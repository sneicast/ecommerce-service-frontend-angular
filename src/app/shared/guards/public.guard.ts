import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageUtil } from '../utils/session-storage.util';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Si el usuario está autenticado, redirigir al admin
    if (SessionStorageUtil.isAuthenticated()) {
      this.router.navigate(['/admin/products']);
      return false; // No mostrar la página pública
    } else {
      return true; // Permitir acceso a páginas públicas
    }
  }
} 