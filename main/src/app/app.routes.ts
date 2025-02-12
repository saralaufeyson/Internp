import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { MentorMenteesComponent } from './components/mentor-mentees/mentor-mentees.component';
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
        
      },
      {
        path: 'intern-list',
        component: InternListComponent,
      
      },
      {
        path: 'all-goals',
        component: AllGoalsComponent,
       
      },
      {
        path: 'mentor-mentees',
        component: MentorMenteesComponent,
       
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