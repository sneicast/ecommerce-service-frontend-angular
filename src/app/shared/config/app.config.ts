import { environment } from '../../../environments/environment';

export const AppConfig = {
  apiUrl: environment.apiUrl,
  production: environment.production,
  
  // Configuración de la aplicación
  app: {
    name: 'Ecommerce App',
    version: '1.0.0'
  }
}; 