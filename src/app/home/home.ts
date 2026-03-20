import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeService } from './home-service';
import { ExpenseList } from './expense-list/expense-list';
import { Expense, ExpenseSummary } from '../models/expense.model';

type ViewState = 'loading' | 'loaded' | 'empty' | 'error';

@Component({
  selector: 'app-home',
  imports: [ExpenseList, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  viewState: ViewState = 'loading';
  expenses: Expense[] = [];
  summary: ExpenseSummary | null = null;
  errorMessage: string | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.viewState = 'loading';
    this.errorMessage = null;

    this.homeService.getExpenses().subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
        this.viewState = expenses.length > 0 ? 'loaded' : 'empty';
        this.loadSummary();
      },
      error: () => {
        this.viewState = 'error';
        this.errorMessage = 'Failed to load expenses. Please try again.';
      },
    });
  }

  private loadSummary(): void {
    this.homeService.getSummary().subscribe({
      next: (summary: ExpenseSummary) => {
        this.summary = summary;
      },
      error: () => {
        this.summary = null;
      },
    });
  }

  retry(): void {
    this.loadData();
  }
}
