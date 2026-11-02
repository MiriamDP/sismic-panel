import { Component } from '@angular/core';
import { EarthquakeList } from '../../components/earthquake-list/earthquake-list';

@Component({
  selector: 'app-historic-page',
  imports: [EarthquakeList],
  templateUrl: './historic-page.html',
  styleUrl: './historic-page.css',
})
export class HistoricPage {}
