import { Component } from '@angular/core';
import {DashboardFooter} from '../../components/dashboard-footer/dashboard-footer';
import {DashboardHeader} from '../../components/dashboard-header/dashboard-header';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardFooter,
    DashboardHeader,
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor() {}
}
