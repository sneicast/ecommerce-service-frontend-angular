import { Routes } from '@angular/router';
import { AdminLayout } from './shared/layout/admin-layout/admin-layout';
import { AuthGuard } from './shared/guards/auth.guard';
import { PublicGuard } from './shared/guards/public.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        canActivate: [PublicGuard], // Redirigir usuarios autenticados
        loadComponent: () => import('./features/auth/pages/login/login-page').then(m => m.LoginPage)
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [AuthGuard], // Proteger toda la ruta admin
        children: [
            {
                path: 'products',
                loadComponent: () => import('./features/products/pages/products/products-page').then(m => m.ProductsPage)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/pages/users/users-page').then(m => m.UsersPage)
            },
            {
                path: 'customers',
                loadComponent: () => import('./features/customers/pages/customers/customers-page').then(m => m.CustomersPage)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/page/orders-page/orders-page').then(m => m.OrdersPage)
            },
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
