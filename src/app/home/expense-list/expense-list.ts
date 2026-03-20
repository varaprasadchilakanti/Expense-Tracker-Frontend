import { Component, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  @Input({ required: true }) data!: Expense;
}
