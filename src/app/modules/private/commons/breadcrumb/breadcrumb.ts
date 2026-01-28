import {Component, Input} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterModule,
    BreadcrumbModule,
    CommonModule,
    TagModule
  ],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  @Input() itemsBread: MenuItem[] | undefined;
}
