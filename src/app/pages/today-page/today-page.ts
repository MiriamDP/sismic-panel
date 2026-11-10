import { Component, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map';
import { Stat } from '../../components/stat/stat';
import { STAT_ICONS } from '../../utils/stats-icons';
import { Earthquake } from '../../interfaces/earthquake';

@Component({
  selector: 'app-today-page',
  imports: [MapComponent, Stat],
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
  omitted =signal(0);
}
