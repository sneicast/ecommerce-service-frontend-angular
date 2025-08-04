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
        canActivate: [PublicGuard], 
        loadComponent: () => import('./features/auth/pages/login/login-page').then(m => m.LoginPage)
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [AuthGuard], 
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/home/pages/home-page/home-page').then(m => m.HomePage)
            },
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
                path: 'promotions',
                loadComponent: () => import('./features/promotions/pages/promotions/promotions-page').then(m => m.PromotionsPage)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
