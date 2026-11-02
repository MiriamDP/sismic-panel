import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EarthquakeService } from '../../services/earthquake-service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-earthquake-list',
  imports: [DatePipe],
  templateUrl: './earthquake-list.html',
  styleUrl: './earthquake-list.css',
})
export class EarthquakeList {
  private earthquakeSvc=inject(EarthquakeService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  queryParams  = toSignal(this.activatedRoute.queryParamMap.pipe(
    map(params => ({
        page: Number(params.get('page')) || 1,
        pageSize: Number(params.get('pageSize')) || 20
      })),
  ), {
    initialValue: {
        page: 1,
        pageSize: 20
      }
  });

  page = linkedSignal(() => this.queryParams().page);
  pageSize = linkedSignal(() => this.queryParams().pageSize);

  
  navigateEffect=effect(() => {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          page: this.page(),
          pageSize: this.pageSize()
        },
        queryParamsHandling: 'merge'
      });
    });

  earthquakesResource=rxResource(
    {
    params: () => { return {
      page: this.page(),pageSize:this.pageSize()
    }},
    stream: ({ params }) => {
      return this.earthquakeSvc.getEarthquakes(
        params.page,
        params.pageSize
      );
    },
  }
  )
// Ir a la página siguiente
  nextPage(): void {
    const pagination = this.earthquakesResource.value()?.pagination;

    if (pagination?.has_next) {
      this.page.update(value => value + 1);
    }
  }

  // Ir a la página anterior
  previousPage(): void {
    const pagination = this.earthquakesResource.value()?.pagination;

    if (pagination?.has_previous) {
      this.page.update(value => value - 1);
    }
  }

  // Cambiar tamaño de página
  changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  // Recargar datos
  reload(): void {
    this.earthquakesResource.reload();
  }
}

