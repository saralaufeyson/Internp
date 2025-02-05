import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { LearningPathComponent } from '../components/learning-path/learning-path.component'; // ✅ Import Learning Path Component
import { GoalsComponent } from '../components/goals/goals.component'; // ✅ Import Goals Component
import { PocProjectsComponent } from '../components/poc-projects/poc-projects.component'; // ✅ Import PoC Projects Component
import { UserProfileComponent } from '../components/userprofile/userprofile.component';
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
    data: {
      title: 'Profile',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Profile' },
      ],
    },
  },
  {
    path: 'learningPath',  // ✅ Added My Learning Path route
    component: LearningPathComponent,
    data: {
      title: 'My Learning Path',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Learning Path' },
      ],
    },
  },
  {
    path: 'goals',  // ✅ Added My Goals route
    component: GoalsComponent,
    data: {
      title: 'My Goals',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My Goals' },
      ],
    },
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    data: { title: 'User Profile' },
  },
  
  {
    path: 'pocProjects',  // ✅ Added My PoC Projects route
    component: PocProjectsComponent,
    data: {
      title: 'My PoC Projects',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'My PoC Projects' },
      ],
    },
  },
];
