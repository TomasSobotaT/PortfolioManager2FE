import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth-service';

const API_BASE_URL = 'http://localhost:3000';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const jwtToken = authService.getAccessToken();
  const isBaseApi = request.url.startsWith(API_BASE_URL);
  const isAuthEndpoint = request.url.startsWith(`${API_BASE_URL}/auth/`);

  if (!isBaseApi || isAuthEndpoint || !jwtToken || request.headers.has('Authorization')) {
    return next(request);
  }

  const authReq = request.clone({ setHeaders: { Authorization: `Bearer ${jwtToken}` } });
  return next(authReq);
};
