import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { refreshInterceptor } from './core/interceptors/refresh.interceptor';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/config/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor])),
    provideRouter(routes),
    provideStore(),
    provideEffects(),
    provideRouterStore(),
    isDevMode() ? provideStoreDevtools({ maxAge: 25 }) : [],
  ],
};
