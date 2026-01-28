import { Routes } from '@angular/router';
import {RootResolver} from './config/commons/root.resolver';
import {Content} from './modules/private/dashboard/pages/content/content';
import {GuestGuard} from './config/commons/guest.guard';
import {dashboardRoutes} from './modules/private/dashboard/dashboard.routes';
import {AuthGuard} from './config/commons/auth.guard';
import {Dashboard} from './modules/private/dashboard/pages/dashboard/dashboard';
import {operativoRoutes} from './modules/private/operativo/operativo.routes';

export const routes: Routes = [
  {
    path: '',
    resolve: { redirect: RootResolver },
    children: []
  },
  {
    path: 'content',
    component: Content,
    canActivate: [GuestGuard]
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
    redirectTo: 'content'
  }
];
