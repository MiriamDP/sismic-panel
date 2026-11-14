import { Component, computed, input } from '@angular/core';
import { EarthquakeMetrics } from '../../../../interfaces/earthquake';
import { EARTHQUAKE_ICONS } from '../../../../utils/earthquake-icons';
import { STAT_ICONS } from '../../../../utils/stats-icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-comparison-summary',
  imports: [DecimalPipe],
  templateUrl: './comparison-summary.html',
  styleUrl: './comparison-summary.css',
})
export class ComparisonSummary {
  firstYear = input.required<number>();
  secondYear = input.required<number>();

  firstData = input.required<EarthquakeMetrics['summary']>();
  secondData = input.required<EarthquakeMetrics['summary']>();

  icons = EARTHQUAKE_ICONS;
  icons_stats = STAT_ICONS;

  averageLabel = input.required<string>();

  metrics = computed(() => {

    const first = this.firstData();
    const second = this.secondData();

    return [
      {
        title: 'Total de terremotos',
        firstValue: first.total_earthquakes,
        secondValue: second.total_earthquakes,
        icon: this.icons_stats.total,
        decimals: 0
      },
      {
        title: this.averageLabel(),
        firstValue: first.average_per_hour ?? first.average_per_day,
        secondValue: second.average_per_hour ?? second.average_per_day,
        icon: this.icons.average,
        decimals: 2
      },
      {
        title: 'Magnitud media',
        firstValue: first.average_magnitude,
        secondValue: second.average_magnitude,
        icon: this.icons.activity,
        decimals: 2
      },
      {
        title: 'Profundidad media',
        firstValue: first.average_depth,
        secondValue: second.average_depth,
        icon: this.icons.depth,
        decimals: 2
      }
    ];

  });

  getDifference(first: number | null, second: number | null): number | null {

    if (first === null || second === null) {
      return null;
    }

    return second - first;
  }

  getPercentage(first: number | null, second: number | null): number | null {

    if (first === null || second === null || first === 0) {
      return null;
    }

    return ((second - first) / first) * 100;
  }
}
