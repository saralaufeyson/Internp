import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Intern Dashboard',
    iconName: 'dashboard',
    route: '/dashboard/intern-dashboard',
    roles: ['intern']
  },
  {
    displayName: 'Admin Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard/admin',
    roles: [ 'admin']
  },
  {
    displayName: 'Mentor Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard/mentor',
    roles: [ 'mentor']
  },
  {
    displayName: 'Profile',
    iconName: 'info-circle',
    route: '/dashboard/profile',
    roles: ['intern', 'admin','mentor']
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
    displayName: 'Intern Reviews',
    iconName: 'users',
    route: '/dashboard/admin-reviews',
    roles: ['admin']
    
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
export const internNavItems: NavItem[] = navItems.filter(item => item.roles?.includes('intern'));
export const adminNavItems: NavItem[] = navItems.filter(item => item.roles?.includes('admin'));