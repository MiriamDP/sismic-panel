import { Component, computed, input } from '@angular/core';
import { BaseChart } from '../../../../../utils/components/charts/base-chart/base-chart';
import { ChartConfiguration } from 'chart.js';
import { EarthquakeMetrics } from '../../../../../interfaces/earthquake';

@Component({
  selector: 'app-comparison-magnitude-depth',
  imports: [BaseChart],
  templateUrl: './comparison-magnitude-depth.html',
  styleUrl: './comparison-magnitude-depth.css',
})
export class ComparisonMagnitudeDepth {
  firstYear = input.required<number>();
  secondYear = input.required<number>();

  firstData = input.required<EarthquakeMetrics['magnitude_depth']>();
  secondData = input.required<EarthquakeMetrics['magnitude_depth']>();

  chartConfig = computed<ChartConfiguration<'scatter'>>(() => {

    const first = this.firstData();
    const second = this.secondData();
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--color-primary').trim();
    const success = styles.getPropertyValue('--color-success').trim();

    return {
      type: 'scatter',

      data: {
        datasets: [
          {
            label: String(this.firstYear()),

            data: first.map(item => ({
              x: item.magnitude,
              y: item.depth
            })),

            backgroundColor: `color-mix(in srgb, ${primary} 65%, transparent)`,
            borderColor: primary,

            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: String(this.secondYear()),

            data: second.map(item => ({
              x: item.magnitude,
              y: item.depth
            })),

            backgroundColor: `color-mix(in srgb, ${success} 65%, transparent)`,
            borderColor: success,

            pointRadius: 4,
            pointHoverRadius: 7
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: 'nearest',
          intersect: true
        },

        plugins: {
          legend: {
            display: true,
            position: 'top'
          },

          tooltip: {
            callbacks: {
              label: context => {

                const point = context.raw as {
                  x: number;
                  y: number;
                };

                return [
                  `Año: ${context.dataset.label}`,
                  `Magnitud: ${point.x}`,
                  `Profundidad: ${point.y} km`
                ];
              }
            }
          }
        },

        scales: {
          x: {
            type: 'linear',

            title: {
              display: true,
              text: 'Magnitud'
            },

            grid: {
              display: true
            }
          },

          y: {
            type: 'linear',
            beginAtZero: true,

            title: {
              display: true,
              text: 'Profundidad (km)'
            },

            grid: {
              display: true
            }
          }
        }
      }
    };
  });
}
