import { Component, input } from '@angular/core';
import { EarthquakeMetrics } from '../../../interfaces/earthquake';
import { DecimalPipe } from '@angular/common';
import { Stat } from '../../stat/stat';
import { EARTHQUAKE_ICONS } from '../../../utils/earthquake-icons';
import { STAT_ICONS } from '../../../utils/stats-icons';

@Component({
  selector: 'app-metrics-summary',
  imports: [DecimalPipe, Stat],
  templateUrl: './metrics-summary.html',
  styleUrl: './metrics-summary.css',
})
export class MetricsSummary {
  data = input.required<EarthquakeMetrics['summary']>();
  icons = EARTHQUAKE_ICONS;
  icons_stats = STAT_ICONS;

  averageLabel = input.required<string>();
}
