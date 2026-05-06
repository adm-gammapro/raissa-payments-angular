import { Routes } from '@angular/router';
import {Authorized} from './config/authorized/authorized';
import {Login} from './config/login/login';
import {AuthGuard} from './config/commons/auth.guard';
import {Content} from './modules/private/dashboard/pages/content/content';
import {GuestGuard} from './config/commons/guest.guard';
import {Logout} from './config/logout/logout';
import {Dashboard} from './modules/private/dashboard/pages/dashboard/dashboard';
import {operativoRoutes} from './modules/private/operativo/operativo.routes';
import {dashboardRoutes} from './modules/private/dashboard/dashboard.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'authorized',
    component: Authorized
  },
  {
    path: 'login',
    component: Login,
    canActivate: [AuthGuard]
  },
  {
    path: 'content',
    component: Content,
    canActivate: [GuestGuard]
  },
  {
    path: 'logout',
    component: Logout,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: 'operativo',
        canActivate: [AuthGuard],
        children: operativoRoutes
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: dashboardRoutes
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
