import { Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { EarthquakeMetrics } from '../../../../../interfaces/earthquake';
import { BaseChart } from '../../../../../utils/components/charts/base-chart/base-chart';

@Component({
  selector: 'app-comparison-time-distribution',
  imports: [BaseChart],
  templateUrl: './comparison-time-distribution.html',
  styleUrl: './comparison-time-distribution.css',
})
export class ComparisonTimeDistribution {
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
   * Genera una clave común para alinear los datos
   * de ambos años.
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
   * Ordena cronológicamente las claves del intervalo.
   */
  private sortKeys(keys: string[]): string[] {

    return keys.sort((a, b) => {

      if (this.firstData().granularity === 'hour') {
        return a.localeCompare(b);
      }

      return a.localeCompare(b);
    });
  }

  /**
   * Genera las etiquetas del eje X.
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

  chartConfig = computed<ChartConfiguration<'bar'>>(() => {

    const first = this.firstData();
    const second = this.secondData();

    // Agrupar datos del primer año.
    const firstMap = new Map(
      first.data.map(item => [
        this.getDateKey(item.date),
        item.count
      ])
    );

    // Agrupar datos del segundo año.
    const secondMap = new Map(
      second.data.map(item => [
        this.getDateKey(item.date),
        item.count
      ])
    );

    // Obtener todas las fechas existentes en ambos años.
    const keys = new Set([
      ...firstMap.keys(),
      ...secondMap.keys()
    ]);

    const sortedKeys = this.sortKeys([...keys]);
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue('--color-primary').trim();
    const success = styles.getPropertyValue('--color-success').trim();

    return {
      type: 'bar',

      data: {
        labels: sortedKeys.map(key => this.formatLabel(key)),
        datasets: [
          {
            label: String(this.firstYear()),
            data: sortedKeys.map(key => firstMap.get(key) ?? 0),

            backgroundColor: `color-mix(in srgb, ${primary} 65%, transparent)`,
            borderColor: primary,
            borderWidth: 1,
            borderRadius: 4,

            grouped: false,
            barThickness: 20
          },
          {
            label: String(this.secondYear()),
            data: sortedKeys.map(key => secondMap.get(key) ?? 0),

            backgroundColor: `color-mix(in srgb, ${success} 65%, transparent)`,
            borderColor: success,
            borderWidth: 1,
            borderRadius: 4,

            grouped: false,
            barThickness: 10
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
