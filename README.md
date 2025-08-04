# 🛒 E-commerce Service Frontend

Una aplicación web de comercio electrónico desarrollada con **Angular 20** y **TailwindCSS**, diseñada para gestionar productos, clientes, pedidos, promociones y usuarios de manera eficiente.

## 🚀 Características

- **Gestión de Productos**: CRUD completo con control de inventario
- **Administración de Clientes**: Registro y gestión de información de clientes
- **Procesamiento de Pedidos**: Creación, seguimiento y gestión de órdenes
- **Sistema de Promociones**: Creación y aplicación de descuentos
- **Gestión de Usuarios**: Control de acceso y roles
- **Autenticación**: Sistema de login seguro con guards
- **Reportes**: Visualización de datos de ventas y analytics
- **Interfaz Responsiva**: Diseño adaptativo con TailwindCSS

## 🛠️ Tecnologías

- **Frontend**: Angular 20
- **Estilos**: TailwindCSS 4.1.11, SCSS
- **Testing**: Jasmine, Karma
- **Herramientas**: Angular CLI, TypeScript 5.8
- **Formato**: Prettier

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sneicast/ecommerce-service-frontend-angular.git
   cd ecommerce-service-frontend-angular
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Revisar y ajustar los archivos en `src/environments/`
   - Asegurar que las URLs del backend estén correctamente configuradas

## 🚀 Uso

### Desarrollo
```bash
npm start
# o
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

### Construcción para producción
```bash
npm run build
# o
ng build
```

### Ejecutar tests
```bash
npm test
# o
ng test
```

### Modo watch para desarrollo
```bash
npm run watch
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── features/          # Módulos de funcionalidades
│   │   ├── auth/         # Autenticación
│   │   ├── customers/    # Gestión de clientes
│   │   ├── orders/       # Gestión de pedidos
│   │   ├── products/     # Gestión de productos
│   │   ├── promotions/   # Gestión de promociones
│   │   └── users/        # Gestión de usuarios
│   └── shared/           # Componentes y servicios compartidos
│       ├── components/   # Componentes reutilizables
│       ├── guards/       # Guards de autenticación
│       ├── interceptors/ # Interceptores HTTP
│       └── services/     # Servicios compartidos
└── environments/         # Configuraciones por ambiente
```

## 🔗 Backend

Este frontend funciona en conjunto con el backend desarrollado en Java Spring Boot:
- **Repositorio**: [ecommerce-service-backend-java](https://github.com/sneicast/ecommerce-service-backend-java)
- Asegurar que el backend esté ejecutándose antes de usar la aplicación


⚡ **Nota**: Asegurar que el backend esté ejecutándose en el puerto configurado antes de iniciar la aplicación frontend.