import { Component, inject, ViewChild } from '@angular/core';
import { ImportList } from '../../components/import-list/import-list';
import { EarthquakeService } from '../../services/earthquake-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ImportForm } from '../../components/import-form/import-form';
import { ImportJob, ImportJobRequest } from '../../interfaces/import-job';
import { ImportStatus } from '../../components/import-status/import-status';
import { Subject, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-import-page',
  imports: [ImportList, ImportForm, ImportStatus],
  templateUrl: './import-page.html',
  styleUrl: './import-page.css',
})
export class ImportPage {
  private earthquakeSvc = inject(EarthquakeService);

  private refreshImports$ = new Subject<void>();

  readonly importJobs = toSignal(
    this.refreshImports$.pipe(
      startWith(undefined),
      switchMap(() => this.earthquakeSvc.getImports())
    ),
    { initialValue: [] }
  );

  @ViewChild(ImportStatus)
  importStatus?: ImportStatus;

  createImport(form: ImportJobRequest) {

    if (!form.start || !form.end) {
      return;
    }

    this.earthquakeSvc.importHistory(
      this.formatDate(form.start),
      this.formatDate(form.end),
      form.mag
    ).subscribe({

      next: response => {

        console.log('Importación iniciada:', response);

        // Actualizar estado de la última importación
        this.importStatus?.refresh();

        // Actualizar listado de importaciones
        this.refreshImports$.next();

      },

      error: error => {
        console.error('Error iniciando importación:', error);
      }

    });
  }

  private formatDate(value: string | Date): string {

    const date = value instanceof Date
      ? value
      : new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
