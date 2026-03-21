import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { HomeService } from '../home-service';
import { CategoryBreakdown } from '../../models/expense.model';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  DoughnutController
);

type ChartViewState = 'idle' | 'loading' | 'loaded' | 'empty' | 'error';
type ChartType = 'bar' | 'doughnut';

@Component({
  selector: 'app-category-chart',
  imports: [],
  templateUrl: './category-chart.html',
  styleUrl: './category-chart.css',
})
export class CategoryChart implements OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  viewState: ChartViewState = 'idle';
  chartType: ChartType = 'bar';
  private chart: Chart | null = null;
  private breakdown: CategoryBreakdown[] = [];

  constructor(private homeService: HomeService) {}

  ngOnDestroy(): void {
    this.destroyChart();
  }

  selectChartType(type: ChartType): void {
    if (this.chartType === type) {
      return;
    }
    this.chartType = type;
    if (this.viewState === 'loaded' && this.breakdown.length > 0) {
      this.destroyChart();
      this.renderChart();
    }
  }

  fetchBreakdown(): void {
    if (this.viewState === 'loading') {
      return;
    }

    this.viewState = 'loading';
    this.breakdown = [];
    this.destroyChart();

    this.homeService.getCategoryBreakdown().subscribe({
      next: (data: CategoryBreakdown[]) => {
        if (data.length === 0) {
          this.viewState = 'empty';
          return;
        }
        this.breakdown = data;
        this.viewState = 'loaded';
        setTimeout(() => this.renderChart(), 0);
      },
      error: () => {
        this.viewState = 'error';
      },
    });
  }

  private renderChart(): void {
    if (!this.chartCanvas?.nativeElement) {
      return;
    }

    const labels = this.breakdown.map(item => item.category);
    const values = this.breakdown.map(item => parseFloat(item.total));

    const baseColors = [
      '#3b6fd4', '#22c55e', '#f59e0b', '#ef4444', '#38bdf8',
      '#a78bfa', '#fb923c', '#34d399', '#f472b6', '#60a5fa',
      '#facc15', '#4ade80', '#f87171', '#818cf8', '#2dd4bf',
      '#e879f9', '#fbbf24', '#86efac', '#fca5a5', '#93c5fd',
    ];

    const colors = labels.map(
      (_, i) => baseColors[i % baseColors.length]
    );

    const config: ChartConfiguration =
      this.chartType === 'bar'
        ? this.buildBarConfig(labels, values, colors)
        : this.buildDoughnutConfig(labels, values, colors);

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  private buildBarConfig(
    labels: string[],
    values: number[],
    colors: string[]
  ): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Spend (INR)',
            data: values,
            backgroundColor: colors.map(c => c + '99'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx =>
                ` ₹${(ctx.parsed.x as number).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: '#2a3040' },
            ticks: {
              color: '#9aa0b4',
              callback: val =>
                `₹${Number(val).toLocaleString('en-IN')}`,
            },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#9aa0b4' },
          },
        },
      },
    };
  }

  private buildDoughnutConfig(
    labels: string[],
    values: number[],
    colors: string[]
  ): ChartConfiguration {
    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.map(c => c + '99'),
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#9aa0b4',
              padding: 16,
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = (ctx.dataset.data as number[]).reduce(
                  (a, b) => a + b,
                  0
                );
                const value = ctx.parsed as number;
                const pct = ((value / total) * 100).toFixed(1);
                return ` ₹${value.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} (${pct}%)`;
              },
            },
          },
        },
      },
    };
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
