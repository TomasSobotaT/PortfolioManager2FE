import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, finalize, map, tap } from 'rxjs';

import { LoginRequest } from '../../shared/models/auth/login-request';
import { LoginResponse } from '../../shared/models/auth/login-response';

const API_BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private access$ = new BehaviorSubject<string | null>(null);
  readonly token$ = this.access$.asObservable();
  private httpClient = inject(HttpClient);

  getAccessToken(): string | null {
    return this.access$.value;
  }

  setAccessToken(token: string | null): void {
    this.access$.next(token);
  }

  isAuthenticated(): boolean {
    return !!this.access$.value;
  }

  authHeaders(): { headers: HttpHeaders } {
    const jwtToken = this.getAccessToken();
    return { headers: new HttpHeaders(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}) };
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, body, { withCredentials: true })
      .pipe(tap((response) => this.setAccessToken(response.accessToken)));
  }

  logout(): void {
    this.httpClient
      .post(`${API_BASE_URL}/auth/logout`, null, { withCredentials: true })
      .pipe(
        catchError(() => EMPTY),
        finalize(() => this.setAccessToken(null)),
      )
      .subscribe();
  }

  refreshAccessToken(): Observable<string> {
    return this.httpClient
      .post<LoginResponse>(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => this.setAccessToken(response.accessToken)),
        map((response) => response.accessToken),
      );
  }
}
