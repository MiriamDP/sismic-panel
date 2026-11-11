import { Component, inject } from '@angular/core';
import { EarthquakeService } from '../../services/earthquake-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Stat } from '../../components/stat/stat';
import { SimpleMap } from '../../components/simple-map/simple-map';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EARTHQUAKE_ICONS } from '../../utils/earthquake-icons';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  selector: 'app-earthquake-detail-page',
  imports: [Stat,SimpleMap,DatePipe,LucideArrowLeft,DecimalPipe],
  templateUrl: './earthquake-detail-page.html',
  styleUrl: './earthquake-detail-page.css',
})
export class EarthquakeDetailPage {
  private earthquakeSvc= inject(EarthquakeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  icons = EARTHQUAKE_ICONS;

  id = this.route.snapshot.paramMap.get('id')!;

  earthquake=this.earthquakeSvc.getEarthquake(this.id);

  goBack() {
  const state = history.state;

  this.router.navigate(['/historic'], {
    queryParams: {
      page: state.page ?? 1,
      pageSize: state.pageSize ?? 20
    }
  });
  }
}
