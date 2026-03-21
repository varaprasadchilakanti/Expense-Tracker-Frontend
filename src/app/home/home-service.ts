import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Expense,
  CreateExpensePayload,
  ExpenseSummary,
  CategoryBreakdown,
  InsightResult
} from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      environment.apiUrl + '/api/expenses/?ordering=-created_at'
    );
  }

  postExpenses(payload: CreateExpensePayload): Observable<Expense> {
    return this.http.post<Expense>(
      environment.apiUrl + '/api/expenses/',
      payload
    );
  }

  getSummary(): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(
      environment.apiUrl + '/api/expenses/summary/'
    );
  }

  getCategoryBreakdown(): Observable<CategoryBreakdown[]> {
    return this.http.get<CategoryBreakdown[]>(
      environment.apiUrl + '/api/expenses/category-breakdown/'
    );
  }

  getInsights(): Observable<InsightResult> {
    return this.http.get<InsightResult>(
      environment.apiUrl + '/api/expenses/insights/'
    );
  }
}
