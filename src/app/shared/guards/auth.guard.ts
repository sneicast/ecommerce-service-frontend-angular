import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageUtil } from '../utils/session-storage.util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si existe el token en sessionStorage
    if (SessionStorageUtil.isAuthenticated()) {
      return true; // Permitir acceso
    } else {
      // Redirigir a login si no hay token
      this.router.navigate(['/login']);
      return false; // Denegar acceso
    }
  }
} 