import { Routes } from '@angular/router';
import { AllGoalsComponent } from '../components/all-goals/all-goals.component';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LearningPathComponent } from '../components/learning-path/learning-path.component';
import { GoalsComponent } from '../components/goals/goals.component';
import { PocProjectsComponent } from '../components/poc-projects/poc-projects.component';
import { InternListComponent } from '../intern-list/intern-list.component';
import { InternGuard } from '../guards/intern.guard'; // Import InternGuard
import { AdminGuard } from '../guards/admin.guard'; // Import AdminGuard
import { MentorListComponent } from '../mentor-list/mentor-list.component'; // Import MentorListComponent

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Dashboard',
      urls: [{ title: 'Dashboard', url: '/dashboard' }],
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    //canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'Profile',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Profile' },
      ],
    },
  },
  {
    path: 'learningPath',
    component: LearningPathComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Learning Path',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Learning Path' },
      ],
    },
  },
  {
    path: 'goals',
    component: GoalsComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My Goals',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Goals' },
      ],
    },
  },
  {
    path: 'pocProjects',
    component: PocProjectsComponent,
    canActivate: [InternGuard], // Apply InternGuard
    data: {
      title: 'My PoC Projects',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My PoC Projects' },
      ],
    },
  },
  {
    path: 'intern-list',
    component: InternListComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All Interns',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Interns' },
      ],
    },
  },
  {
    path: 'all-goals',
    component: AllGoalsComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All goals',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Interns' },
      ],
    },
  },
  {
    path: 'mentor-list',
    component: MentorListComponent,
    canActivate: [AdminGuard], // Apply AdminGuard
    data: {
      title: 'All Mentors',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'All Mentors' },
      ],
    },
  },
];
