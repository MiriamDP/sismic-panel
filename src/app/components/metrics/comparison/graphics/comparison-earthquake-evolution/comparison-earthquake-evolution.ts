import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { EarthquakeMetrics } from '../../../../../interfaces/earthquake';
import { BaseChart } from '../../../../../utils/components/charts/base-chart/base-chart';

@Component({
  selector: 'app-comparison-earthquake-evolution',
  imports: [BaseChart],
  templateUrl: './comparison-earthquake-evolution.html',
  styleUrl: './comparison-earthquake-evolution.css',
})
export class ComparisonEarthquakeEvolution {
  firstYear = input.required<number>();
  secondYear = input.required<number>();

  firstData = input.required<EarthquakeMetrics['time_distribution']>();
  secondData = input.required<EarthquakeMetrics['time_distribution']>();

  granularityLabel = computed(() => {

    const labels = {
      hour: 'por hora',
      day: 'por día',
      month: 'por mes'
    };

    return labels[this.firstData().granularity];
  });

  /**
   * Obtiene una clave común para ambos años.
   */
  private getDateKey(dateString: string): string {

    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    if (this.firstData().granularity === 'hour') {

      const hour = String(date.getUTCHours()).padStart(2, '0');
      const minute = String(date.getUTCMinutes()).padStart(2, '0');

      return `${hour}:${minute}`;
    }

    if (this.firstData().granularity === 'month') {
      return month;
    }

    return `${month}-${day}`;
  }

  /**
   * Formatea las etiquetas del eje X.
   */
  private formatLabel(key: string): string {

    if (this.firstData().granularity === 'hour') {
      return key;
    }

    if (this.firstData().granularity === 'month') {

      const date = new Date(Date.UTC(2000, Number(key) - 1, 1));

      return date.toLocaleDateString('es-ES', {
        month: 'short',
        timeZone: 'UTC'
      });
    }

    const [month, day] = key.split('-').map(Number);

    const date = new Date(Date.UTC(2000, month - 1, day));

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC'
    });
  }

  chartConfig = computed<ChartConfiguration<'line'>>(() => {

    const first = this.firstData();
    const second = this.secondData();

    const firstMap = new Map(
      first.data.map(item => [
        this.getDateKey(item.date),
        item.count
      ])
    );

    const secondMap = new Map(
      second.data.map(item => [
        this.getDateKey(item.date),
        item.count
      ])
    );

    const keys = new Set([
      ...firstMap.keys(),
      ...secondMap.keys()
    ]);

    const sortedKeys = [...keys].sort((a, b) => a.localeCompare(b));
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--color-primary').trim();
    const success = styles.getPropertyValue('--color-success').trim();
    return {
      type: 'line',

      data: {
        labels: sortedKeys.map(key => this.formatLabel(key)),

        datasets: [
          {
            label: String(this.firstYear()),
            data: sortedKeys.map(key => firstMap.get(key) ?? 0),

            borderColor: primary,
            backgroundColor: 'rgba(59, 130, 246, 0.12)',

            tension: 0.3,
            fill: false,

            pointRadius: 3,
            pointHoverRadius: 6
          },
          {
            label: String(this.secondYear()),
            data: sortedKeys.map(key => secondMap.get(key) ?? 0),

            borderColor: success,
            backgroundColor: 'rgba(22, 163, 74, 0.12)',

            tension: 0.3,
            fill: false,

            pointRadius: 3,
            pointHoverRadius: 6
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: 'index',
          intersect: false
        },

        plugins: {
          legend: {
            display: true,
            position: 'top'
          },

          tooltip: {
            callbacks: {
              label: context =>
                `${context.dataset.label}: ${context.parsed.y} terremotos`
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
