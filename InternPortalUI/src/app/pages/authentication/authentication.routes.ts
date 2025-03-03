import { Routes } from '@angular/router';

import { SideLoginComponent } from './side-login/side-login.component';
import { SideRegisterComponent } from './side-register/side-register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: SideLoginComponent,
      },
      {
        path: 'register',
        component: SideRegisterComponent,
      },
    ],
  },
];