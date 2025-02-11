import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { AuthGuard } from './guards/auth.guard'; // ✅ Import Auth Guard
import { RoleGuard } from './guards/role.guard'; // ✅ Import Role Guard

import { AllGoalsComponent } from './components/all-goals/all-goals.component';
import { InternListComponent } from './intern-list/intern-list.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/pages.routes').then((m) => m.PagesRoutes),
        canActivate: [AuthGuard], // ✅ Protect Dashboard
      },
      {
        path: 'user-details',
        component: UserDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'intern-list',
        component: InternListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] }, // ✅ Restrict to Admins
      },
      {
        path: 'all-goals',
        component: AllGoalsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] },
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
          import('./pages/authentication/authentication.routes').then((m) => m.AuthenticationRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'authentication/error' }, // Redirect to error page if route not found
];
