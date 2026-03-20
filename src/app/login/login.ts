import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login-service';
import { LoginPayload } from '../models/auth.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(private loginService: LoginService, private router: Router) {}

  get username() {
    return this.form.get('username')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.loginService.login(this.form.value as LoginPayload).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Invalid username or password. Please try again.';
      },
    });
  }
}
