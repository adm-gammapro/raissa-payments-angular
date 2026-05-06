import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {Router} from '@angular/router';

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
  styleUrl: './dashboard-header.css',
})
export class DashboardHeader implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  protected nombreUsuarioSesion: string = 'Administrador';
  protected timeRemaining: string = '';
  private intervalId: number | null = null;

  constructor(private readonly messageService: MessageService,
              private readonly tokenService: Token,
              private readonly router: Router
  ) {
    this.initializeMenuItems();
  }

  ngOnInit(): void {
    this.nombreUsuarioSesion = sessionStorage.getItem(environment.session.NOMBRES_USUARIO) || 'Usuario';

    // Iniciar el temporizador
    this.updateTimeRemaining();
    this.intervalId = setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  onLogout(): void {
    this.tokenService.clear();
    location.href = environment.security.logout_url;
  }

  onLogoutExpress(): void {
    this.tokenService.clear();
    this.router.navigate(['/dashboard']);
  }

  mostrarPerfil() {
    this.messageService.add({
      severity: 'success',
      summary: 'Perfil',
      detail: `Perfil de ${this.nombreUsuarioSesion}`,
    });
  }

  private updateTimeRemaining(): void {
    const expiresInSeconds = sessionStorage.getItem(environment.session.EXPIRES_IN);
    const loginAt = sessionStorage.getItem(environment.session.LOGIN_AT);

    if (!expiresInSeconds || !loginAt) {
      this.timeRemaining = '';
      return;
    }

    // Calcular timestamp absoluto de expiración
    const expiresAt = Number(loginAt) + (Number(expiresInSeconds) * 1000);
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      this.timeRemaining = 'Sesión expirada';
      this.onLogoutExpress();
      return;
    }

    // Formatear tiempo restante
    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      this.timeRemaining = `${hours}h ${minutes}m ${seconds}s restantes`;
    } else if (minutes > 0) {
      this.timeRemaining = `${minutes}m ${seconds}s restantes`;
    } else {
      this.timeRemaining = `${seconds}s restantes`;
    }
  }

  private initializeMenuItems(): void {
    this.items = [
      {
        label: 'Mostrar perfil',
        icon: 'pi pi-user',
        command: () => {
          this.mostrarPerfil();
        },
      },
      { separator: true },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {
          this.onLogout();
        },
      },
    ];
  }
}
