import {Routes} from '@angular/router';
import {Solicitud} from './pages/solicitud/solicitud';
import {CargarSolicitud} from './pages/cargar-solicitud/cargar-solicitud';

export const operativoRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'gestionar' },
  {
    path: 'gestionar',
    children: [
      { path: '', component: Solicitud, data: { modo: 'gestionar' } }
    ]
  },
  {
    path: 'validar',
    children: [
      { path: '', component: Solicitud, data: { modo: 'validar' } }
    ]
  },
  {
    path: 'autorizar',
    children: [
      { path: '', component: Solicitud, data: { modo: 'autorizar' } }
    ]
  },
  {
    path: 'ejecutar',
    children: [
      { path: '', component: Solicitud, data: { modo: 'ejecutar' } }
    ]
  },
  {
    path: 'cargar-solicitud',
    children: [
      { path: '', component: CargarSolicitud }
    ]
  }
];
