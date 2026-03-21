import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  constructor(private http: HttpClient) {}

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  refreshAccessToken(): Observable<TokenResponse> {
    const refresh = this.getRefreshToken();
    return this.http
      .post<TokenResponse>(
        environment.apiUrl + '/api/token/refresh/',
        { refresh }
      )
      .pipe(
        tap((response: TokenResponse) => {
          localStorage.setItem(this.ACCESS_KEY, response.access);
        })
      );
  }
}
