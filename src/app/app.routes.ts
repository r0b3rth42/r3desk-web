import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'callback',
        loadComponent: () => 
            import('./features/auth/pages/callback/callback.component')
                .then(m => m.CallbackComponent)
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/pages/login/login.component')
                .then(m => m.LoginComponent)
    },
    
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard], // ⚡ CAMBIO CLAVE: Protege el Layout y CUALQUIER ruta hija automáticamente
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/pages/dashboard-home/dashboard-home.component')
                        .then(m => m.DashboardHomeComponent)
            },
            {
                path: 'tickets',
                loadComponent: () =>
                    import('./features/tickets/pages/ticket-list/ticket-list.component')
                        .then(m => m.TicketListComponent)
            },
            {
                path: 'tickets/new',
                loadComponent: () =>
                    import('./features/tickets/pages/create-ticket/create-ticket.component')
                        .then(m => m.CreateTicketComponent)
            },
            {
                path: 'tickets/:id',
                loadComponent: () => 
                    import('./features/tickets/pages/ticket-detail/ticket-detail.component')
                        .then(m => m.TicketDetailComponent)
            },
            {
                path: 'areas',
                loadComponent: () => 
                    import('./features/mantenimiento/pages/area/area.component')
                        .then(m => m.AreaComponent)
            },
            {
                path: 'grupos',
                loadComponent: () => 
                    import('./features/mantenimiento/pages/grupo/grupo.component')
                        .then(m => m.GrupoComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard', // Si entra al layout vacío, por defecto lo manda al dashboard interno
                pathMatch: 'full'
            }
        ]
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: '**', // ⚡ Captura cualquier otra ruta inválida y la manda al login seguro
        redirectTo: 'login'
    }
];