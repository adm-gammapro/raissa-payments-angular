import {Component, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {BreadcrumbComponent} from '../../../administrativo/components/breadcrumb/breadcrumb.component';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DetalleSolicitud} from '../../components/solicitud/detalle-solicitud/detalle-solicitud';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {BadgeModule} from 'primeng/badge';
import { DatePickerModule } from 'primeng/datepicker';
import {FileUpload, FileUploadEvent} from 'primeng/fileupload';

interface SolicitudInterface {
  id: number;
  fecha: string;
  usuario: string;
  tramas: number;
}

@Component({
  selector: 'app-cargar-solicitud',
  imports: [
    BadgeModule,
    TableModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    BreadcrumbComponent,
    TooltipModule,
    ToastModule,
    ConfirmDialogModule,
    DetalleSolicitud,
    DatePickerModule,
    FileUpload
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cargar-solicitud.html',
  styleUrl: './cargar-solicitud.scss',
})
export class CargarSolicitud implements OnInit {
  allSolicitudes: SolicitudInterface[] = [];
  filtroForm: FormGroup;
  visible: boolean = false;
  first = 0;

  misItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Cargar solicitudes'}
  ];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.filtroForm = this.fb.group({
      fecha: [''],
    });
  }

  ngOnInit(): void {
    this.allSolicitudes = [
      { id: 1, fecha: '2026-01-19 09:10', usuario: 'jrojas', tramas: 5 },
      { id: 2, fecha: '2026-01-19 09:25', usuario: 'mruiz', tramas: 8 },
      { id: 3, fecha: '2026-01-19 09:40', usuario: 'acarhuam', tramas: 12 },
      { id: 4, fecha: '2026-01-19 10:05', usuario: 'mlopez', tramas: 20 },
      { id: 5, fecha: '2026-01-19 10:15', usuario: 'cgarcia', tramas: 7 },
      { id: 6, fecha: '2026-01-19 10:30', usuario: 'dtorres', tramas: 4 },
      { id: 7, fecha: '2026-01-18 15:20', usuario: 'ealvarez', tramas: 6 },
      { id: 8, fecha: '2026-01-18 15:45', usuario: 'lramirez', tramas: 9 },
      { id: 9, fecha: '2026-01-18 16:00', usuario: 'rquiroz', tramas: 18 },
      { id: 10, fecha: '2026-01-18 16:25', usuario: 'vruiz', tramas: 3 },
      { id: 11, fecha: '2026-01-18 17:05', usuario: 'fcastro', tramas: 11 },
      { id: 12, fecha: '2026-01-18 17:30', usuario: 'kespinoza', tramas: 2 },
      { id: 13, fecha: '2026-01-17 11:10', usuario: 'mgutierrez', tramas: 14 },
      { id: 14, fecha: '2026-01-17 11:40', usuario: 'jvaldez', tramas: 22 },
      { id: 15, fecha: '2026-01-17 12:05', usuario: 'srodriguez', tramas: 10 },
      { id: 16, fecha: '2026-01-17 12:05', usuario: 'srodriguez', tramas: 10 },
      { id: 17, fecha: '2026-01-17 12:05', usuario: 'srodriguez', tramas: 10 },
      { id: 18, fecha: '2026-01-17 12:05', usuario: 'srodriguez', tramas: 10 },
    ];
  }

  filtrar() {}

  limpiarFiltros() {}

  detalle() {
    this.visible = true;
  }

  onBasicUploadAuto(event: FileUploadEvent) {
    console.log('Subidos:', event.files);
    this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: 'Archivo cargado correctamente' });
  }
}
