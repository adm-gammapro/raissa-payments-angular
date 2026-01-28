import {Component, OnInit, ViewChild} from '@angular/core';
import {Drawer, DrawerModule} from 'primeng/drawer';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-dashboard-menu',
  imports: [DrawerModule, ButtonModule, Menu],
  providers: [MessageService],
  templateUrl: './dashboard-menu.html',
  styleUrl: './dashboard-menu.scss',
})
export class DashboardMenu implements OnInit {
  @ViewChild('drawerRef') drawerRef!: Drawer;
  items: MenuItem[] | undefined;
  visible: boolean = false;

  constructor(private readonly router: Router) {
  }

  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Administrativo',
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-users',
          },
          {
            label: 'Perfiles',
            icon: 'pi pi-address-book',
          }
        ]
      },
      {
        label: 'Operativo',
        items: [
          {
            label: 'Cargar solicitudes',
            icon: 'pi pi-file-import',
            command: () => this.navigateAndClose('/operativo/cargar-solicitud')
          },
          {
            label: 'Gestionar',
            icon: 'pi pi-file',
            command: () => this.navigateAndClose('/operativo/gestionar')
          },
          {
            label: 'Validar',
            icon: 'pi pi-file',
            command: () => this.navigateAndClose('/operativo/validar')
          },
          {
            label: 'Autorizar',
            icon: 'pi pi-file-check',
            command: () => this.navigateAndClose('/operativo/autorizar')
          },
          {
            label: 'Ejecutar',
            icon: 'pi pi-file-export',
            command: () => this.navigateAndClose('/operativo/ejecutar')
          }
        ]
      },
      {
        separator: true
      }
    ];
  }

  navigateAndClose(path: string) {
    this.router.navigate([path])


    this.drawerRef.close({
      preventDefault: () => {
      }
    } as unknown as Event);
  }
}
