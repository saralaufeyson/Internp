import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    displayName: 'Profile',
    iconName: 'info-circle',
    route: '/dashboard/profile',
  },
  {
    displayName: 'My learning Path',
    iconName: 'archive',
    route: '/dashboard/learningPath',
  },
  {
    displayName: 'My Goals',
    iconName: 'list-details',
    route: '/dashboard/goals',
  },
  {
    displayName: 'My PoC Projects',
    iconName: 'file-text-ai',
    route: '/dashboard/pocProjects',
  },
  {
    displayName: 'All Interns',
    iconName: 'user',
    route: '/dashboard/intern-list',
  },
  {
    displayName: 'All Goals',
    iconName: 'user',
    route: '/dashboard/all-goals',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'login',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
  },

];