import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  constructor(/*private readonly dashboardService: DashboardService*/) {}

  onObtenerUsuario(): string {
    //this.dashboardService.obtenerUsuario();
    return "USER";
  }
}
