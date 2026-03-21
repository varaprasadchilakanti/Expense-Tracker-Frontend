import { Component } from '@angular/core';
import { HomeService } from '../home-service';
import { InsightResult } from '../../models/expense.model';

type InsightState = 'idle' | 'loading' | 'loaded' | 'rate-limited' | 'error';

@Component({
  selector: 'app-insights-panel',
  imports: [],
  templateUrl: './insights-panel.html',
  styleUrl: './insights-panel.css',
})
export class InsightsPanel {
  insightState: InsightState = 'idle';
  insights: string[] = [];
  isCached = false;

  constructor(private homeService: HomeService) {}

  fetchInsights(): void {
    if (this.insightState === 'loading') {
      return;
    }

    this.insightState = 'loading';
    this.insights = [];

    this.homeService.getInsights().subscribe({
      next: (result: InsightResult) => {
        this.insights = result.insights;
        this.isCached = result.cached;
        this.insightState = 'loaded';
      },
      error: (err) => {
        if (err?.status === 429) {
          this.insightState = 'rate-limited';
        } else {
          this.insightState = 'error';
        }
      },
    });
  }
}
