import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expense-list',
  imports: [],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  @Input({ required: true}) data !: any;
}
