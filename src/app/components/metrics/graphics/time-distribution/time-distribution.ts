import { Component, computed, input } from '@angular/core';
import { EarthquakeMetrics } from '../../../../interfaces/earthquake';
import { BaseChart } from '../../../../utils/components/charts/base-chart/base-chart';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-time-distribution',
  imports: [BaseChart],
  templateUrl: './time-distribution.html',
  styleUrl: './time-distribution.css',
})
export class TimeDistribution {
  data = input.required<EarthquakeMetrics['time_distribution']>();
  granularityLabel = computed(() => {

    const labels = {
      hour: 'por hora',
      day: 'por día',
      month: 'por mes'
    };

    return labels[this.data().granularity];
  });

  chartConfig = computed<ChartConfiguration<'bar'>>(() => {

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
      type: 'bar',

      data: {
        labels,

        datasets: [{
          label: 'Terremotos',
          data: distribution.data.map(item => item.count),

          backgroundColor: 'rgba(59, 130, 246, 0.75)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 5,
          maxBarThickness: 45
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
            title: {
              display: true,
              text: this.granularityLabel()
            },

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
