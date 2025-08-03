import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  isFormValid: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  validateForm(): void {
    // Validar que el email tenga formato válido y la contraseña tenga al menos 6 caracteres
    const emailValid = this.isValidEmail(this.loginData.email);
    const passwordValid = this.loginData.password.length >= 6;
    
    this.isFormValid = emailValid && passwordValid;
    this.errorMessage = ''; // Limpiar mensaje de error al validar
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onLogin(): void {
    if (!this.isFormValid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.isLoading = false;
        
        // Aquí podrías redirigir al usuario a la página principal
        // this.router.navigate(['/dashboard']);
        
        // Por ahora solo mostramos un mensaje de éxito
        alert('¡Login exitoso! Token guardado en sessionStorage');
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.isLoading = false;
        this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}
