import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth-service';

const API_BASE_URL = 'http://localhost:3000';

let refreshInProcess: Observable<string> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (request, next) => {
  const isBaseApi = request.url.startsWith(API_BASE_URL);
  const isAuthEndpoint = request.url.startsWith(`${API_BASE_URL}/auth/`);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isBaseApi || isAuthEndpoint || error.status !== 401) {
        return throwError(() => error);
      }

      const authService = inject(AuthService);

      if (!refreshInProcess) {
        refreshInProcess = authService.refreshAccessToken().pipe(
          shareReplay(1),
          finalize(() => (refreshInProcess = null)),
        );
      }

      return refreshInProcess.pipe(
        switchMap((token) => {
          if (!token) return throwError(() => error);
          const retriedRequest = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next(retriedRequest);
        }),
      );
    }),
  );
};
