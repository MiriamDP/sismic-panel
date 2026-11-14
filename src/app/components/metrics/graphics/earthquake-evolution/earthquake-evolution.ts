import { Component, computed, input } from '@angular/core';
import { EarthquakeMetrics } from '../../../../interfaces/earthquake';
import { ChartConfiguration } from 'chart.js';
import { BaseChart } from '../../../../utils/components/charts/base-chart/base-chart';

@Component({
  selector: 'app-earthquake-evolution',
  imports: [BaseChart],
  templateUrl: './earthquake-evolution.html',
  styleUrl: './earthquake-evolution.css',
})
export class EarthquakeEvolution {
  data = input.required<EarthquakeMetrics['time_distribution']>();

  chartConfig = computed<ChartConfiguration<'line'>>(() => {

    const distribution = this.data();

    const labels = distribution.data.map(item => {

      const date = new Date(item.date);

      if (distribution.granularity === 'hour') {

        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        });

      }

      if (distribution.granularity === 'day') {

        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          timeZone: 'UTC'
        });

      }

      return date.toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      });

    });

    return {
      type: 'line',

      data: {
        labels,

        datasets: [{
          label: 'Terremotos',
          data: distribution.data.map(item => item.count),

          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.12)',

          fill: true,
          tension: 0.3,

          pointRadius: 3,
          pointHoverRadius: 6
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
              label: context => `${context.parsed.y} terremotos`
            }
          }
        },

        scales: {
          x: {
            grid: {
              display: false
            }
          },

          y: {
            beginAtZero: true,

            title: {
              display: true,
              text: 'Número de terremotos'
            },

            ticks: {
              precision: 0
            }
          }
        }
      }
    };
  });
}
