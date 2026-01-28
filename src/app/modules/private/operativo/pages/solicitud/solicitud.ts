import {Component, OnInit} from '@angular/core';
import {BadgeModule} from 'primeng/badge';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import {BreadcrumbComponent} from '../../../administrativo/components/breadcrumb/breadcrumb.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ActivatedRoute, Router} from '@angular/router';
import {DetalleSolicitud} from '../../components/solicitud/detalle-solicitud/detalle-solicitud';
import {Observaciones} from '../../components/solicitud/observaciones/observaciones';
import {Track} from '../../components/solicitud/track/track';
import { DatePicker } from 'primeng/datepicker';
import {MultiSelectModule} from 'primeng/multiselect';
import {FactorAutenticacion} from '../../components/solicitud/factor-autenticacion/factor-autenticacion';

type Estado = 'REGISTRADO' | 'VALIDADO' | 'OBSERVADO' | 'ENVIADO' | 'ANULADO' | 'AUTORIZADO' | 'PROC_TOTAL' | 'PROC_PARCIAL';

interface SolicitudInterface {
  id: number;
  fecha: string;
  estado: Estado;
  usuario: string;
  tramas: number;
}

interface EstadoSolicitudInterface {
  codigo: string,
  descripcion: string
}

@Component({
  selector: 'app-solicitud',
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
    Observaciones,
    Track,
    DatePicker,
    MultiSelectModule,
    FactorAutenticacion
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.scss',
})
export class Solicitud implements OnInit {
  solicitudes: SolicitudInterface[] = [];
  allSolicitudes: SolicitudInterface[] = [];
  filtroForm: FormGroup;
  estadoSolicitud: EstadoSolicitudInterface[] | undefined;
  estadoSolicitudFiltrada: EstadoSolicitudInterface[] | undefined;
  modo!: 'gestionar' | 'validar' | 'autorizar' | 'ejecutar';
  visibleResumen: boolean = false;
  visibleObservaciones: boolean = false;
  visibleTrack: boolean = false;
  visibleFactor: boolean = false;
  solicitudSeleccionadaId?: number;
  first = 0;
  rows = 10;
  modoObservaciones: 'ver' | 'anular' | 'observar' = 'ver';
  IndicadorMostrar: boolean = false;

  misItems: MenuItem[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.filtroForm = this.fb.group({
      codigo: [''],
      fecha: [''],
      usuario: [''],
      estado: this.fb.control<Estado[]>([])
    });
  }

  ngOnInit(): void {
    this.modo = this.route.snapshot.data['modo'];

    this.allSolicitudes = [
      { id: 1, fecha: '2026-01-19 09:10', estado: 'REGISTRADO', usuario: 'jrojas', tramas: 5 },
      { id: 2, fecha: '2026-01-19 09:25', estado: 'REGISTRADO', usuario: 'mruiz', tramas: 8 },
      { id: 3, fecha: '2026-01-19 09:40', estado: 'VALIDADO', usuario: 'acarhuam', tramas: 12 },
      { id: 4, fecha: '2026-01-19 10:05', estado: 'VALIDADO', usuario: 'mlopez', tramas: 20 },
      { id: 5, fecha: '2026-01-19 10:15', estado: 'OBSERVADO', usuario: 'cgarcia', tramas: 7 },
      { id: 6, fecha: '2026-01-19 10:30', estado: 'OBSERVADO', usuario: 'dtorres', tramas: 4 },
      { id: 7, fecha: '2026-01-18 15:20', estado: 'ENVIADO', usuario: 'ealvarez', tramas: 6 },
      { id: 8, fecha: '2026-01-18 15:45', estado: 'ENVIADO', usuario: 'lramirez', tramas: 9 },
      { id: 9, fecha: '2026-01-18 16:00', estado: 'ENVIADO', usuario: 'rquiroz', tramas: 18 },
      { id: 10, fecha: '2026-01-18 16:25', estado: 'OBSERVADO', usuario: 'vruiz', tramas: 3 },
      { id: 11, fecha: '2026-01-18 17:05', estado: 'ANULADO', usuario: 'fcastro', tramas: 11 },
      { id: 12, fecha: '2026-01-18 17:30', estado: 'ANULADO', usuario: 'kespinoza', tramas: 2 },
      { id: 13, fecha: '2026-01-17 11:10', estado: 'AUTORIZADO', usuario: 'mgutierrez', tramas: 14 },
      { id: 14, fecha: '2026-01-17 11:40', estado: 'AUTORIZADO', usuario: 'jvaldez', tramas: 22 },
      { id: 15, fecha: '2026-01-17 12:05', estado: 'PROC_TOTAL', usuario: 'srodriguez', tramas: 10 },
      { id: 16, fecha: '2026-01-17 12:05', estado: 'PROC_TOTAL', usuario: 'srodriguez', tramas: 10 },
      { id: 17, fecha: '2026-01-17 12:05', estado: 'PROC_PARCIAL', usuario: 'srodriguez', tramas: 10 },
      { id: 18, fecha: '2026-01-17 12:05', estado: 'PROC_PARCIAL', usuario: 'srodriguez', tramas: 10 },
    ];

    this.estadoSolicitud = [
      { codigo: 'REGISTRADO', descripcion: 'Registrado' },
      { codigo: 'VALIDADO', descripcion: 'Validado' },
      { codigo: 'OBSERVADO', descripcion: 'Observado' },
      { codigo: 'ENVIADO', descripcion: 'Pendiente de autorización' },
      { codigo: 'ANULADO', descripcion: 'Anulado' },
      { codigo: 'AUTORIZADO', descripcion: 'Autorizado' },
      { codigo: 'PROC_TOTAL', descripcion: 'Procesado total' },
      { codigo: 'PROC_PARCIAL', descripcion: 'Procesado parcial' }
    ];

    this.estadoSolicitudFiltrada = this.estadoSolicitud;

    this.filtrarPorModo();

    this.cargarBreadcrumb();
  }

  estadoLabel(estado: Estado): string {
    switch (estado) {
      case 'REGISTRADO': return 'Registrado';
      case 'VALIDADO': return 'Validado';
      case 'OBSERVADO': return 'Observado';
      case 'ENVIADO': return 'Pendiente de autorización';
      case 'ANULADO': return 'Anulado';
      case 'AUTORIZADO': return 'Autorizado';
      case 'PROC_TOTAL': return 'Procesado total';
      case 'PROC_PARCIAL': return 'Procesado parcial';
      default: return estado;
    }
  }

  badgeStyle(estado: Estado) {
    const map: Record<Estado, { bg: string; fg: string }> = {
      REGISTRADO: { bg: '#1d4ed8', fg: '#ffffff' }, // Azul
      VALIDADO: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      ENVIADO: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      PROC_TOTAL: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      AUTORIZADO: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      ANULADO: { bg: '#f97316', fg: '#111827' }, // Naranja
      PROC_PARCIAL: { bg: '#dc2626', fg: '#ffffff' }, // Rojo
      OBSERVADO: { bg: '#dc2626', fg: '#ffffff' }, // Rojo
    };
    const { bg, fg } = map[estado];
    return {
      backgroundColor: bg,
      color: fg,
      borderRadius: '999px',
      padding: '0.25rem 0.75rem',
      fontWeight: 600,
    };
  }
  filtrar() {}

  limpiarFiltros() {}

  solicitarAutorizacion(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de enviar solicitud a autorización?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Enviar',
        severity: 'info'
      },

      accept: () => {
        this.visibleFactor = true;
        this.solicitudSeleccionadaId = id;
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se pudo enviar solicitud a autorización' });
      }
    });
  }

  validar(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de iniciar validación?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Enviar',
        severity: 'info'
      },

      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmación',
          detail: 'Se validó solicitud correctamente',
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se pudo validar solicitud' });
      }
    });
  }

  autorizar(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de autorizar solicitud?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Autorizar',
        severity: 'info'
      },

      accept: () => {
        this.visibleFactor = true;
        this.solicitudSeleccionadaId = id;
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se pudo autorizar solicitud' });
      }
    });
  }

  procesar(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de procesar solictud?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Procesar',
        severity: 'info'
      },

      accept: () => {
        this.visibleFactor = true;
        this.solicitudSeleccionadaId = id;
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se pudo procesar solictud' });
      }
    });
  }

  verResumen(event: Event, solicitud: SolicitudInterface) {
    const { id, estado } = solicitud;

    this.IndicadorMostrar = estado === 'PROC_TOTAL' || estado === 'PROC_PARCIAL';
    this.visibleResumen = true;
  }

  verTrack(event: Event, id: number) {
    this.visibleTrack = true;
  }

  verDetalle(event: Event, id: number) {
    this.modoObservaciones = 'ver';
    this.visibleObservaciones = true;
  }

  anular(event: Event, id: number) {
    this.modoObservaciones = 'anular';
    this.visibleObservaciones = true;
  }

  observar(event: Event, id: number) {
    this.modoObservaciones = 'observar';
    this.visibleObservaciones = true;
  }

  cargarBreadcrumb() {
    const labels: Record<string, string> = {
      gestionar: 'Gestión de solicitudes',
      validar: 'Validación solicitudes',
      autorizar: 'Autorización solicitudes',
      ejecutar: 'Ejecución solicitudes',
    };

    const label = labels[this.modo] ?? 'Solicitudes';
    this.misItems = [
      { icon: 'pi pi-home', route: '/dashboard' },
      { label },
    ];
  }

  onAutenticado() {
    const id = this.solicitudSeleccionadaId;
    if (id == null) return;

    // Aquí tu lógica comentada
    this.allSolicitudes = this.allSolicitudes.filter(s => s.id !== id);
    this.solicitudes     = this.solicitudes.filter(s => s.id !== id);

    this.messageService.add({
      severity: 'success',
      summary: 'Confirmación',
      detail: 'Se realizó petición solicitada',
    });

    this.visibleFactor = false;
    this.solicitudSeleccionadaId = undefined;
  }

  private filtrarPorModo() {
    const estados = this.estadosPorModo[this.modo];
    if (estados?.length) {
      // Opciones visibles en el multiselect
      // @ts-ignore
      this.estadoSolicitudFiltrada = this.estadoSolicitud.filter(e => estados.includes(e.codigo));
      // Preselección según modo
      const preset = this.preselectPorModo[this.modo] ?? [];
      this.filtroForm.get('estado')?.setValue(preset);
      // Filtra la tabla
      this.solicitudes = this.allSolicitudes.filter(s => estados.includes(s.estado));
    } else {
      this.estadoSolicitudFiltrada = this.estadoSolicitud;
      this.filtroForm.get('estado')?.setValue([]);
      this.solicitudes = this.allSolicitudes;
    }
  }

  private readonly estadosPorModo: Record<string, Estado[]> = {
    validar: ['REGISTRADO', 'VALIDADO', 'OBSERVADO', 'ANULADO'],
    autorizar: ['ENVIADO'],
    ejecutar: ['AUTORIZADO', 'PROC_TOTAL', 'PROC_PARCIAL']
  };

  private readonly preselectPorModo: Record<string, Estado[]> = {
    validar: ['REGISTRADO', 'VALIDADO'],
    autorizar: ['ENVIADO'],
    ejecutar: ['AUTORIZADO']
  };
}
