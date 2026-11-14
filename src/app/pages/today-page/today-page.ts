import { Component, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map';
import { Stat } from '../../components/stat/stat';
import { STAT_ICONS } from '../../utils/stats-icons';
import { Earthquake } from '../../interfaces/earthquake';
import { SessionList } from '../../components/session-list/session-list';
import { EarthquakeStoreService } from '../../services/earthquake-store-service';

@Component({
  selector: 'app-today-page',
  imports: [MapComponent, Stat, SessionList],
  templateUrl: './today-page.html',
  styleUrl: './today-page.css',
})
export class TodayPage {
  statIcons=STAT_ICONS;
  count= signal(0);
  date=signal('Sin fecha')
  hour=signal ('Sin hora')
  total=signal(0);
  earthquake=signal<null|Earthquake>(null)

  private earthquakeStore = inject(EarthquakeStoreService);

  omitted = this.earthquakeStore.omittedSession;
}
