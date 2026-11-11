import { Component, effect, inject, linkedSignal } from '@angular/core';
import { EarthquakeList } from '../../components/earthquake-list/earthquake-list';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { EarthquakeService } from '../../services/earthquake-service';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-historic-page',
  imports: [EarthquakeList, Pagination],
  templateUrl: './historic-page.html',
  styleUrl: './historic-page.css',
})
export class HistoricPage {
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

  changePage(page:number){
    const pagination = this.earthquakesResource.value()?.pagination;

    this.page.update(value => page);

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
