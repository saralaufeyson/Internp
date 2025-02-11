import { Routes } from '@angular/router';
import { AllGoalsComponent } from '../components/all-goals/all-goals.component';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LearningPathComponent } from '../components/learning-path/learning-path.component';
import { GoalsComponent } from '../components/goals/goals.component';
import { PocProjectsComponent } from '../components/poc-projects/poc-projects.component';
import { InternListComponent } from '../intern-list/intern-list.component';
import { AuthGuard } from '../guards/auth.guard'; // ✅ Import Auth Guard
import { RoleGuard } from '../guards/role.guard'; // ✅ Import Role Guard

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: { title: 'Dashboard', urls: [{ title: 'Dashboard', url: '/dashboard' }] },
    canActivate: [AuthGuard], // ✅ Protect route
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'Profile' }] },
    canActivate: [AuthGuard],
  },
  {
    path: 'learningPath',
    component: LearningPathComponent,
    data: { title: 'My Learning Path', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'My Learning Path' }], roles: ['intern'] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'goals',
    component: GoalsComponent,
    data: { title: 'My Goals', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'My Goals' }], roles: ['intern'] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'pocProjects',
    component: PocProjectsComponent,
    data: { title: 'My PoC Projects', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'My PoC Projects' }], roles: ['intern'] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'intern-list',
    component: InternListComponent,
    data: { title: 'All Interns', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'All Interns' }], roles: ['admin'] },
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'all-goals',
    component: AllGoalsComponent,
    data: { title: 'All goals', urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'All Goals' }], roles: ['admin'] },
    canActivate: [AuthGuard, RoleGuard],
  },];