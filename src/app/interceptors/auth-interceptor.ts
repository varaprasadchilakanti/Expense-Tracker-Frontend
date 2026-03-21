import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const access = authService.getAccessToken();

  let authReq = req;
  if (access) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getRefreshToken()) {
        return authService.refreshAccessToken().pipe(
          switchMap(response => {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
            return next(newReq);
          }),
          catchError(err => {
            authService.clearTokens();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
