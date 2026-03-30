import {Routes} from '@angular/router';
import {Solicitud} from './pages/solicitud/solicitud';
import {CargarSolicitud} from './pages/cargar-solicitud/cargar-solicitud';
import {ConfiguracionReglas} from './pages/configuracion-reglas/configuracion-reglas';
import {Reglas} from './pages/reglas/reglas';
import {Categorias} from './pages/categorias/categorias';
import {TipoPago} from './pages/tipo-pago/tipo-pago';

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
  },
  {
    path: 'configuracion-reglas',
    children: [
      { path: '', component: ConfiguracionReglas }
    ]
  }
  ,
  {
    path: 'reglas',
    children: [
      { path: '', component: Reglas }
    ]
  },
  {
    path: 'categorias',
    children: [
      { path: '', component: Categorias }
    ]
  },
  {
    path: 'tipo-pago',
    children: [
      { path: '', component: TipoPago }
    ]
  }
];
