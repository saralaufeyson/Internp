import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ProfileComponent } from '../components/profile/profile.component'; // ✅ Import Profile Component

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Dashboard', // Change title to match Dashboard
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
      ],
    },
  },
  {
    path: 'profile',  // ✅ Added Profile Route under Dashboard
    component: ProfileComponent,
    data: {
      title: 'Profile',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Profile' },
      ],
    },
  },
  
];
