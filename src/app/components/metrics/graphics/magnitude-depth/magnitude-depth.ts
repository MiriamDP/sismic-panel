import { Component, computed, input } from '@angular/core';
import { EarthquakeMetrics } from '../../../../interfaces/earthquake';
import { ChartConfiguration } from 'chart.js';
import { BaseChart } from '../../../../utils/components/charts/base-chart/base-chart';

@Component({
  selector: 'app-magnitude-depth',
  imports: [BaseChart],
  templateUrl: './magnitude-depth.html',
  styleUrl: './magnitude-depth.css',
})
export class MagnitudeDepth {
  data = input.required<EarthquakeMetrics['magnitude_depth']>();
  chartConfig = computed<ChartConfiguration<'scatter'>>(() => {

    const points = this.data().map(item => ({
      x: item.magnitude,
      y: item.depth
    }));

    return {
      type: 'scatter',

      data: {
        datasets: [{
          label: 'Terremotos',
          data: points,

          backgroundColor: 'rgba(249, 115, 22, 0.65)',
          borderColor: '#f97316',

          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: context => {
                const point = context.parsed;

                return `Magnitud: ${point.x} | Profundidad: ${point.y} km`;
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
            }
          },

          y: {
            type: 'linear',

            title: {
              display: true,
              text: 'Profundidad (km)'
            },

            beginAtZero: true
          }
        }
      }
    };
  });
}
