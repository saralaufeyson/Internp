import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { AdminGuard } from './guards/admin.guard';
import { AllGoalsComponent } from './components/all-goals/all-goals.component';
import { InternListComponent } from './intern-list/intern-list.component';
export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'learningPath',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'goals',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'pocProjects',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'user-details',
        component: UserDetailsComponent,
        canActivate: [AdminGuard] // Add a guard to restrict access to admin users
      },
      {
        path: 'intern-list',
        component: InternListComponent,
        canActivate: [AdminGuard] // Protect the route with AdminGuard
      },
      {
        path: 'all-goals',
        component: AllGoalsComponent,
        canActivate: [AdminGuard] // Protect the route with AdminGuard
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];