import {Component, OnInit, ViewChild} from '@angular/core';
import {Drawer, DrawerModule} from 'primeng/drawer';
import {ButtonModule} from 'primeng/button';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {MenuService} from '../../../../../service/modules/private/layout/dashboard/menu';
import {
  MenuUsuarioResponse
} from '../../../../../apis/model/module/private/admnistrativo/dashboard/response/menu-usuario-response';
import {
  ModuloResponse
} from '../../../../../apis/model/module/private/admnistrativo/dashboard/response/modulo-response';
import {MenuResponse} from '../../../../../apis/model/module/private/admnistrativo/dashboard/response/menu-response';
import {Toast} from 'primeng/toast';
import {PanelMenuModule} from 'primeng/panelmenu';
import {CommonModule} from '@angular/common';
import {environment} from '../../../../../../environments/environment';
import {Token} from '../../../../../service/authorization/token';

@Component({
  selector: 'app-dashboard-menu',
  imports: [DrawerModule, ButtonModule, Toast, PanelMenuModule, CommonModule],
  providers: [MessageService],
  templateUrl: './dashboard-menu.html',
  styleUrl: './dashboard-menu.scss',
})
export class DashboardMenu implements OnInit {
  @ViewChild('drawerRef') drawerRef!: Drawer;
  protected items: MenuItem[] | undefined;
  protected visible: boolean = false;
  protected listaModulos: ModuloResponse[] = [];
  protected listaPadres: MenuResponse[] = []
  protected listaOpciones: MenuResponse[] = [];

  constructor(private readonly router: Router,
              private readonly menuService: MenuService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly messageService: MessageService,
              private readonly tokenService: Token) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let user: string | null = sessionStorage.getItem(environment.session.USERNAME);
      let idEmpresa: string | null = sessionStorage.getItem(environment.session.ID_EMPRESA);

      if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
        if (sessionStorage.getItem(environment.session.MENU_ITEMS)) {
          const menuItemsString = sessionStorage.getItem(environment.session.MENU_ITEMS);
          if (menuItemsString) {
            this.items = JSON.parse(menuItemsString) as MenuItem[];
          }
        } else {
          this.menuService.getMenuUsuarios(user, idEmpresa).subscribe({
            next: resp => {
              this.items = this.cargarMenu(resp);
              sessionStorage.setItem(environment.session.MENU_ITEMS, JSON.stringify(this.items));
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: err?.error?.message || 'No se pudo cargar el menú.'
              });
            }
          });
        }
      }
    });
  }

  protected cargarMenu(menuUsuario: MenuUsuarioResponse): MenuItem[] {
    this.listaModulos = menuUsuario.listModulo;
    this.listaPadres = menuUsuario.listOpcionPadres;
    this.listaOpciones = menuUsuario.listOpcionBase;

    return this.convertirModulosAMenuItems(this.listaModulos);

  }

  protected convertirModulosAMenuItems(modulos: ModuloResponse[]): MenuItem[] {

    return modulos.map(modulo => {
      return {
        key: modulo.codigo.toString(), // Asignar codigo a key como string
        label: modulo.nombreModulo,    // Asignar nombreModulo a label
        icon: modulo.icono,            // Asignar icono a icon
        items: this.convertirOpcionesPadreAMenuItems(this.listaPadres, modulo.codigo)
      };
    });
  }

  protected convertirOpcionesPadreAMenuItems(opcionesPadre: MenuResponse[], codigoModulo: number): MenuItem[] {
    return opcionesPadre
      .filter(menu => menu.codigoModulo === codigoModulo)
      .map(menu => {
          return {
            key: menu.codigo.toString(), // Asignar codigo a key como string
            label: menu.descripcionOpcion,    // Asignar nombreModulo a label
            icon: menu.icono,            // Asignar icono a icon
            items: this.convertirOpcionesAMenuItems(this.listaOpciones, menu.codigo)
          };
        }
      );
  }

  protected convertirOpcionesAMenuItems(opciones: MenuResponse[], codigoPadre: number): MenuItem[] {
    return opciones
      .filter(menu => menu.opcionPadre === codigoPadre)
      .map(menu => {
          return {
            key: menu.codigo.toString(), // Asignar codigo a key como string
            label: menu.descripcionOpcion,    // Asignar nombreModulo a label
            icon: menu.icono,            // Asignar icono a icon
            routerLink: menu.rutaOpcion
          };
        }
      );
  }

  protected navigateAndClose(path: string) {
    this.router.navigate([path])


    this.drawerRef.close({
      preventDefault: () => {
      }
    } as unknown as Event);
  }

  protected onLogout(): void {
    this.tokenService.clear();
    location.href = environment.security.logout_url;
  }
}
