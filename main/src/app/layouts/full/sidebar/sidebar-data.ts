import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  { navCap: 'Home' },

  { 
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    roles: ['intern', 'admin','mentor'],
  },
  { 
    displayName: 'Profile',
    iconName: 'info-circle',
    route: '/dashboard/profile',
    roles: ['intern'],
  },
  { 
    displayName: 'My Learning Path',
    iconName: 'archive',
    route: '/dashboard/learningPath',
    roles: ['intern'],
  },
  { 
    displayName: 'My Goals',
    iconName: 'list-details',
    route: '/dashboard/goals',
    roles: ['intern'],
  },
  { 
    displayName: 'My PoC Projects',
    iconName: 'file-text-ai',
    route: '/dashboard/pocProjects',
    roles: ['intern'],
  },
  { 
    displayName: 'All Interns',
    iconName: 'user',
    route: '/dashboard/intern-list',
    roles: ['admin'],
  },
  { 
    displayName: 'All Goals',
    iconName: 'user',
    route: '/dashboard/all-goals',
    roles: ['admin'],
  },

  { navCap: 'Auth' },
  { 
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication/login',
    roles: ['admin','intern','mentor'],
  },
  { 
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
    roles: ['admin','intern','mentor'],
  },
];
