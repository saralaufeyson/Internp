import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: '/dashboard/intern-dashboard',
    roles: ['intern']
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard/admin',
    roles: ['admin']
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard/mentor',
    roles: ['mentor']
  },
  {
    displayName: 'My learning Path',
    iconName: 'archive',
    route: '/dashboard/learningPath',
    roles: ['intern']
  },
  {
    displayName: 'My Goals',
    iconName: 'list-details',
    route: '/dashboard/goals',
    roles: ['intern']
  },
  {
    displayName: 'My PoC Projects',
    iconName: 'file-text-ai',
    route: '/dashboard/pocProjects',
    roles: ['intern']
  },
  {
    displayName: 'My Learning Status',
    iconName: 'school',
    route: '/dashboard/my-learning-status',
    roles: ['intern']
  },
  {
    displayName: 'Aspirations',
    iconName: 'calendar',
    route: '/dashboard/intern-plans',
    roles: ['intern']
  },

  {
    displayName: 'All Interns',
    iconName: 'user',
    route: '/dashboard/intern-list',
    roles: ['admin']
  },
  {
    displayName: 'All Goals',
    iconName: 'user',
    route: '/dashboard/all-goals',
    roles: ['admin']
  },
  {
    displayName: 'All Mentors',
    iconName: 'user',
    route: '/dashboard/mentor-list',
    roles: ['admin']
  },
  {
    displayName: 'Mentors with Interns',
    iconName: 'users',
    route: '/dashboard/mentors-with-interns',
    roles: ['admin']
  },
  {
    displayName: 'Intern Feedback',
    iconName: 'users',
    route: '/dashboard/intern-feedback',
    roles: ['mentor']
  },
  {
    displayName: 'My Feedback',
    iconName: 'users',
    route: '/dashboard/my-feedback',
    roles: ['mentor']
  },
  {
    displayName: 'Performance Summary',
    iconName: 'users',
    route: '/dashboard/admin-reviews',
    roles: ['admin']

  },
  {
    navCap: 'Additional Links',
  },
  {
    displayName: 'Profile',
    iconName: 'User',
    route: '/dashboard/profile',
    roles: ['intern', 'admin', 'mentor']
  }

  
];
export const internNavItems: NavItem[] = navItems.filter(item => item.roles?.includes('intern'));
export const adminNavItems: NavItem[] = navItems.filter(item => item.roles?.includes('admin'));