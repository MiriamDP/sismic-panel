import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, startWith, switchMap, catchError, of, Subject, merge, EMPTY, expand, tap, timer } from 'rxjs';
import { EarthquakeService } from '../../services/earthquake-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-import-status',
  imports: [DatePipe],
  templateUrl: './import-status.html',
  styleUrl: './import-status.css',
})
export class ImportStatus {
  private earthquakeSvc = inject(EarthquakeService);
  private destroyRef = inject(DestroyRef);

  private refreshSubject = new Subject<void>();

  readonly job = signal<any | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  private readonly terminalStates = [
    'completed',
    'failed',
    'interrupted'
  ];

  constructor() {

    this.refreshSubject.pipe(

      startWith(undefined),

      switchMap(() =>
        this.fetchStatus().pipe(

          expand(response => {

            const status = (
              response?.job?.status ??
              this.job()?.status ??
              ''
            ).toLowerCase();

            if (
              !status ||
              this.terminalStates.includes(status)
            ) {
              return EMPTY;
            }

            return timer(10000).pipe(
              switchMap(() => this.fetchStatus())
            );

          })

        )
      ),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe();

  }

  private fetchStatus() {

    return this.earthquakeSvc.getImportStatus().pipe(

      tap(response => {

        this.job.set(response?.job ?? null);
        this.error.set(false);
        this.loading.set(false);

      }),

      catchError(error => {

        console.error('Error consultando importación:', error);

        this.error.set(true);
        this.loading.set(false);

        return of(null);

      })

    );

  }

  refresh(): void {
    this.refreshSubject.next();
  }

}
