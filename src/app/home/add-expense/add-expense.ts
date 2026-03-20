import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../home-service';
import { CreateExpensePayload } from '../../models/expense.model';
import { EXPENSE_CATEGORIES } from '../../config/expense-categories';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  readonly categories = EXPENSE_CATEGORIES;

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(200),
    ]),
    amount: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
      Validators.min(0.01),
    ]),
    category: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private homeService: HomeService, private router: Router) {}

  get title() { return this.form.get('title')!; }
  get amount() { return this.form.get('amount')!; }
  get category() { return this.form.get('category')!; }
  get date() { return this.form.get('date')!; }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.homeService.postExpenses(this.form.value as CreateExpensePayload).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to save expense. Please try again.';
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['']);
  }
}
