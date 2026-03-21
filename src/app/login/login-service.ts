import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  LoginPayload,
  TokenResponse,
  RegisterPayload,
  RegisterResponse
} from '../models/auth.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login(payload: LoginPayload): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(environment.apiUrl + '/api/token/', payload)
      .pipe(
        tap((response: TokenResponse) => {
          this.authService.setTokens(response.access, response.refresh);
        })
      );
  }

  register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      environment.apiUrl + '/api/register/',
      payload
    );
  }

  logout(): void {
    this.authService.clearTokens();
    this.router.navigate(['/login']);
  }
}
