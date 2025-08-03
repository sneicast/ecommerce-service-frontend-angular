export class SessionStorageUtil {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  // Métodos para el token
  static setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  // Métodos para datos del usuario
  static setUserData(userData: any): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  static getUserData(): any {
    const userData = sessionStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static removeUserData(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  // Método para limpiar toda la sesión
  static clearSession(): void {
    this.removeToken();
    this.removeUserData();
  }

  // Método para verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    return this.hasToken();
  }
} 