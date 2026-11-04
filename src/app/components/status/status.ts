import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EarthquakeService } from '../../services/earthquake-service';
import { HealthService } from '../../services/health-service';
import { catchError, interval, map, of, startWith, Subscription, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-status',
  imports: [],
  templateUrl: './status.html',
  styleUrl: './status.css',
})
export class Status {
  private healthSvc=inject(HealthService);

  serverAvailable = toSignal(
    interval(10000).pipe(
      startWith(0),
      switchMap(() =>
        this.healthSvc.getHealth().pipe(
          map(response => response.status === 'ok'),
          catchError(() => of(false))
        )
      )
    ),
    { initialValue: false }
  );
}
