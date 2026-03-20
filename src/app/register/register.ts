import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login/login-service';
import { RegisterPayload } from '../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.loginService.register(this.form.value as RegisterPayload).subscribe({
      next: () => {
        this.successMessage = 'Account created. Redirecting to sign in...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Registration failed. Username or email may already be taken.';
      },
    });
  }
}
