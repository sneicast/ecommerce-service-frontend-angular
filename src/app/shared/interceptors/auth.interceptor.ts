import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionStorageUtil } from '../utils/session-storage.util';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  // Obtener el token del sessionStorage
  const token = SessionStorageUtil.getToken();
  
  if (token) {
    // Clonar la request y agregar el header de autorización
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expirado o inválido
          console.log('Token expirado o inválido, cerrando sesión...');
          
          // Mostrar toast al usuario
          toastService.showWarning('Tu sesión ha expirado. Serás redirigido al login.', 3000);
          
          // Limpiar la sesión
          SessionStorageUtil.clearSession();
          
          // Redirigir al login después de un breve delay
          setTimeout(() => {
            router.navigate(['/login']);
          }, 1000);
        }
        
        return throwError(() => error);
      })
    );
  }
  
  // Si no hay token, continuar con la request original
  return next(request);
}; 