import {Component, OnInit} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {DashboardMenu} from '../dashboard-menu/dashboard-menu';
import {SplitButtonModule} from 'primeng/splitbutton';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {MenuItem, MessageService} from 'primeng/api';
import {Token} from '../../../../../service/authorization/token';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-dashboard-header',
  imports: [
    Menubar,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    DashboardMenu,
    SplitButtonModule,
    ToastModule,
    ButtonModule],
  providers: [MessageService],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.scss',
})
export class DashboardHeader {
  items: MenuItem[] | undefined;
  protected nombreUsuarioSesion: string = 'Administrador';

  constructor(private readonly messageService: MessageService,
              private readonly tokenService: Token
  ) {
    this.items = [
      {
        label: 'Mostrar perfil',
        command: () => {
          this.update();
        }
      },
      { separator: true },
      {
        label: 'Cerrar sesión',
        command: () => {
          this.onLogout();
        }
      }
    ];
  }

  save() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Data Saved',
    });
  }

  update() {
    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Data Updated',
    });
  }

  delete() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Delete',
      detail: 'Data Deleted',
    });
  }

  onLogout(): void {
    this.tokenService.clear();
    location.href = environment.security.logout_url;
  }
}
