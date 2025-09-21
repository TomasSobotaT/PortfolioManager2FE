import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { isDevMode } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/auth.interceptor';
import { refreshInterceptor } from './core/http/refresh.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideHttpClient(withInterceptors([authInterceptor, refreshInterceptor])),

    provideRouter(routes),
    provideStore(),
    provideEffects(),
    provideRouterStore(),

    isDevMode() ? provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }) : [],
  ],
};
