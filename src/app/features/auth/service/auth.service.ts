import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { SessionStorageUtil } from '../../../shared/utils/session-storage.util';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('/api/v1/auth/login', credentials)
      .pipe(
        tap((response: LoginResponse) => {
          // Guardar el token en sessionStorage
          SessionStorageUtil.setToken(response.token);
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    SessionStorageUtil.clearSession();
  }

  isAuthenticated(): boolean {
    return SessionStorageUtil.isAuthenticated();
  }

  getToken(): string | null {
    return SessionStorageUtil.getToken();
  }

  // Método para verificar si el token es válido (opcional)
  validateToken(): Observable<boolean> {
    // Aquí podrías hacer una llamada a un endpoint de validación
    // Por ahora retornamos true si existe el token
    return new Observable(observer => {
      const isValid = SessionStorageUtil.hasToken();
      observer.next(isValid);
      observer.complete();
    });
  }
}
