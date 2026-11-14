import { AfterViewInit, Component, ElementRef, input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-base-chart',
  imports: [],
  templateUrl: './base-chart.html',
  styleUrl: './base-chart.css',
})
export class BaseChart implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  config = input.required<ChartConfiguration>();

  private chart?: Chart;

  private initialized = false;

  ngAfterViewInit(): void {
    this.initialized = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.initialized) {
      this.renderChart();
    }
  }

  private renderChart(): void {

    if (!this.canvas) return;

    this.chart?.destroy();

    this.chart = new Chart(
      this.canvas.nativeElement,
      this.config()
    );
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
