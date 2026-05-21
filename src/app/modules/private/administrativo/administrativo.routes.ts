import {Routes} from '@angular/router';
import {Usuario} from './pages/usuario/usuario';
import {Perfil} from './pages/perfil/perfil';

export const administrativoRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'usuario' },
  {
    path: 'usuario',
    children: [
      { path: '', component: Usuario}
    ]
  },
  {
    path: 'perfil',
    children: [
      { path: '', component: Perfil}
    ]
  }
];
