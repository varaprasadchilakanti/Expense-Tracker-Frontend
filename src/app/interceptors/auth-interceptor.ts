import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const access = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  let authReq = req;
  if(access){
    authReq = req.clone({
      setHeaders: {
        Authorization : `Bearer ${access}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse)=>{
      if(error.status == 401 && refresh){
        return http.post<any>(environment.apiUrl + '/api/token/refresh', {
          refresh: refresh
        }).pipe(
          switchMap(response => {
            localStorage.setItem('access_token', response.access);
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
            return next(newReq);
          }),
          catchError(err=>{
            localStorage.clear();
            router.navigate(['/login'])
            return throwError(()=> err);
          })
        );
      }
      return throwError(()=> error);
    })
  )
};
