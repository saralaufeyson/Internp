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
  // {
  //   navCap: 'Ui Components',
  // },
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
  // {
  //   displayName: 'Lists',
  //   iconName: 'list-details',
  //   route: '/ui-components/lists',
  // },
  // {
  //   displayName: 'Menu',
  //   iconName: 'file-text',
  //   route: '/ui-components/menu',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'file-text-ai',
  //   route: '/ui-components/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'clipboard-text',
  //   route: '/ui-components/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'table',
  //   route: '/ui-components/tables',
  // },
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
  // {
  //   navCap: 'Extra',
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'mood-smile',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'brand-dribbble',
  //   route: '/extra/sample-page',
  // },
];