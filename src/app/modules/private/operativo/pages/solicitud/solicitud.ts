import {Component, OnInit} from '@angular/core';
import {BadgeModule} from 'primeng/badge';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
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
import {environment} from '../../../../../../environments/environment';
import {SolicitudSearch} from '../../../../../apis/model/module/private/operativo/solicitud/request/solicitud-search';
import {
  SolicitudSearchResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/solicitud-search-response';
import {Util} from '../../../../../utils/util/util';
import {SolicitudService} from '../../../../../service/modules/private/operativo/solicitud/solicitud';
import {
  SolicitudResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/solicitud-response';
import {
  CargoSolicitudResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/cargo-solicitud-response';
import {
  FlujoSolicitudRequest
} from '../../../../../apis/model/module/private/operativo/solicitud/request/flujo-solicitud-request';
import {TrackingService} from '../../../../../service/modules/private/operativo/solicitud/tracking';
import {
  TrackingResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/tracking-response';
import {TrackingRequest} from '../../../../../apis/model/module/private/operativo/solicitud/request/tracking-request';
import {TimeStatusPipe} from '../../../../../utils/pipes/time-status-pipe';
import {IftaLabel} from 'primeng/iftalabel';
import {
  ObservacionRequest
} from '../../../../../apis/model/module/private/operativo/solicitud/request/observacion-request';
import {ObservacionService} from '../../../../../service/modules/private/operativo/solicitud/observacion';
import {
  ObservacionResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/observacion-response';
import {Dialog} from 'primeng/dialog';
import {ProgressSpinner} from 'primeng/progressspinner';

type Estado = 'REGISTRADO' | 'VALIDADO' | 'OBSERVADO' | 'PENDIENTE_AUTORIZACION' | 'ANULADO' | 'AUTORIZADO' | 'PROCESADO_TOTAL' | 'PROCESADO_PARCIAL' | 'AUTORIZADO_PARCIAL';

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
    FactorAutenticacion,
    TimeStatusPipe,
    IftaLabel,
    Dialog,
    ProgressSpinner
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.scss',
})
export class Solicitud implements OnInit {
  protected solicitudes!: SolicitudResponse[];
  protected cargosSolicitud!: CargoSolicitudResponse[];
  protected filtroForm: FormGroup;
  protected estadoSolicitud: EstadoSolicitudInterface[] | undefined;
  protected estadoSolicitudFiltrada: EstadoSolicitudInterface[] | undefined;
  protected modo!: 'gestionar' | 'validar' | 'autorizar' | 'ejecutar';
  protected visibleDetalle: boolean = false;
  protected visibleObservaciones: boolean = false;
  protected visibleTrack: boolean = false;
  protected visibleFactor: boolean = false;
  protected solicitudSeleccionadaId?: number;
  protected first = 0;
  protected rows = 10;
  protected modoObservaciones: 'ver' | 'anular' | 'observar' = 'ver';
  protected IndicadorMostrar: boolean = false;
  protected idEmpresa: string = "";
  protected usuarioActual: string = "";
  protected loading: boolean = false;
  protected totalRecords: number = 0;
  protected registrosMostrados = 0;
  protected tracking!: TrackingResponse[];
  protected observaciones!: ObservacionResponse[];
  protected idSolicitud!: number;
  protected eventoObservacion: string = "";
  loadingValidacion: boolean = false;

  misItems: MenuItem[] = [];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly solicitudService: SolicitudService,
    private readonly trackingService: TrackingService,
    private readonly observacionService: ObservacionService,
    private readonly route: ActivatedRoute
  ) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }
    if (sessionStorage.getItem(environment.session.USERNAME) != undefined) {
      this.usuarioActual = sessionStorage.getItem(environment.session.USERNAME)!;
    }

    this.filtroForm = this.fb.group({
      codigoSolicitud: [''],
      fecha: [null as Date[] | null],
      usuario: [''],
      estado: this.fb.control<Estado[]>([])
    });
  }

  ngOnInit(): void {
    this.modo = this.route.snapshot.data['modo'];

    this.estadoSolicitud = [
      { codigo: 'REGISTRADO', descripcion: 'Registrado' },
      { codigo: 'VALIDADO', descripcion: 'Validado' },
      { codigo: 'OBSERVADO', descripcion: 'Observado' },
      { codigo: 'PENDIENTE_AUTORIZACION', descripcion: 'Pendiente de autorización' },
      { codigo: 'ANULADO', descripcion: 'Anulado' },
      { codigo: 'AUTORIZADO', descripcion: 'Autorizado' },
      { codigo: 'AUTORIZADO_PARCIAL', descripcion: 'Autorizado parcial' },
      { codigo: 'PROCESADO_TOTAL', descripcion: 'Procesado total' },
      { codigo: 'PROCESADO_PARCIAL', descripcion: 'Procesado parcial' }
    ];

    this.filtrarPorModo();

    this.cargarBreadcrumb();
  }

  estadoLabel(estado: Estado): string {
    switch (estado) {
      case 'REGISTRADO': return 'Registrado';
      case 'VALIDADO': return 'Validado';
      case 'OBSERVADO': return 'Observado';
      case 'PENDIENTE_AUTORIZACION': return 'Pendiente de autorización';
      case 'ANULADO': return 'Anulado';
      case 'AUTORIZADO': return 'Autorizado';
      case 'AUTORIZADO_PARCIAL': return 'Autorizado parcial';
      case 'PROCESADO_TOTAL': return 'Procesado total';
      case 'PROCESADO_PARCIAL': return 'Procesado parcial';
      default: return estado;
    }
  }

  badgeStyle(estado: Estado) {
    const map: Record<Estado, { bg: string; fg: string }> = {
      REGISTRADO: { bg: '#1d4ed8', fg: '#ffffff' }, // Azul
      VALIDADO: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      PENDIENTE_AUTORIZACION: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      PROCESADO_TOTAL: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      AUTORIZADO: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      AUTORIZADO_PARCIAL: { bg: '#16a34a', fg: '#ffffff' }, // Verde
      ANULADO: { bg: '#dc2626', fg: '#ffffff' }, // Rojo
      PROCESADO_PARCIAL: { bg: '#dc2626', fg: '#ffffff' }, // Rojo
      OBSERVADO: { bg: '#f97316', fg: '#111827' }, // Naranja
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
  filtrar() {
    const fakeLazyEvent: TableLazyLoadEvent = {
      first: 0,
      rows: 5,
      sortField: 'id',
      sortOrder: 1
    };

    this.loadLazy(fakeLazyEvent);
  }

  loadLazy(event: TableLazyLoadEvent) {
    this.loading = true;

    const firstValue = event.first ?? 0;
    const rowsValue = event.rows ?? 5;

    const { codigoSolicitud, usuarioCarga, fecha, estado } = this.filtroForm.value;
    let fechaInicial: string | undefined = undefined;
    let fechaFinal: string | undefined = undefined;

    if (Array.isArray(fecha) && fecha[0]) {
      fechaInicial = Util.formatDate(fecha[0]);

      if (fecha[1]) {
        fechaFinal = Util.formatDate(fecha[1]);
      }
    }

    const estadosSeleccionados: string[] | undefined = (Array.isArray(estado) && estado.length > 0) ? estado : undefined;

    const request: SolicitudSearch = {
      page: Math.floor(firstValue / (rowsValue || 1)),
      size: rowsValue,
      sortField: event.sortField as string,
      sortOrder: Util.mapSortOrder(event.sortOrder),
      usuario: usuarioCarga || undefined,
      fechaInicial: fechaInicial || undefined,
      fechaFinal: fechaFinal || undefined,
      codigo: codigoSolicitud || undefined,
      estadoSolicitud: estadosSeleccionados,
      codigoCliente: this.idEmpresa,
      usuarioActual: this.usuarioActual
    };

    this.solicitudService.getSolicitudesPage(request).subscribe({
      next: (response: SolicitudSearchResponse) => {
        this.solicitudes = response.list;
        this.registrosMostrados = response.list.length;
        this.totalRecords = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio no disponible'
          });
        }
      }
    });
  }

  limpiarFiltros() {
    this.filtroForm.reset({
      codigoSolicitud: '',
      usuarioCarga: '',
      fecha: null,
    });

    this.filtrar();
  }

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
        const payload: FlujoSolicitudRequest = {
          idSolicitud: id,
          flujo: 'enviar-autorizacion',
          codigoCliente: Number(this.idEmpresa)
        };

        this.solicitudService.flujoSolicitudes(payload).subscribe({
          next: (resultado: number) => {
            if(resultado > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmación',
                detail: 'Se envió a autorización solicitud ' + resultado + ' correctamente',
              });
            } else if(resultado == 0) {
              this.messageService.add({
                severity: 'error',
                summary: 'Validación',
                detail: 'No se ubicó solicitud válida',
              });
            } else if(resultado == -1) {
              this.messageService.add({
                severity: 'error',
                summary: 'Validación',
                detail: 'No se encontró configuraciones aplicables',
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Validación',
                detail: 'No se encontró usuarios vinculados a categoria configurada',
              });
            }

            this.filtrar();
          },
          error: (err) => {
            console.error('Error al validar solicitud', err);
          }
        });
        this.solicitudSeleccionadaId = id;
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'No se solicitó autorización' });
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
        this.loadingValidacion = true;

        const payload: FlujoSolicitudRequest = {
          idSolicitud: id,
          flujo: 'validar',
          codigoCliente: Number(this.idEmpresa)
        };

        this.solicitudService.flujoSolicitudes(payload).subscribe({
          next: (resultado: number) => {
            if (resultado == 0) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Confirmación',
                detail: 'Validación de solicitud con observaciones',
              });
            } else if (resultado == -1) {
              this.messageService.add({
                severity: 'error',
                summary: 'Confirmación',
                detail: 'No se pudo completar la validación',
              });
            } else {
              this.messageService.add({
                severity: 'success',
                summary: 'Confirmación',
                detail: 'Se validó solicitud ' + resultado + ' correctamente',
              });
            }

            this.loadingValidacion = false;
            this.filtrar();
          },
          error: (err) => {
            this.loadingValidacion = false;
            console.error('Error al validar solicitud', err);
          }
        });


      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'No se envió a validar solicitud' });
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
        //this.visibleFactor = true;
        //this.solicitudSeleccionadaId = id;

        const payload: FlujoSolicitudRequest = {
          idSolicitud: id,
          flujo: 'ejecutar',
          codigoCliente: Number(this.idEmpresa)
        };

        this.solicitudService.flujoSolicitudes(payload).subscribe({
          next: (resultado: number) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se ejecutó solicitud ' + resultado + ' correctamente',
            });

            this.filtrar();
          },
          error: (err) => {
            console.error('Error al ejecutar solicitud', err);
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se pudo procesar solictud' });
      }
    });
  }

  verResumen(cargos: CargoSolicitudResponse[]) {
    this.cargosSolicitud = cargos;
    this.IndicadorMostrar = false;
    this.visibleDetalle = true;
  }

  verTrack(id: number) {
    const trackRequest: TrackingRequest = {
      idSolicitud: id,
      codigoCliente: Number(this.idEmpresa)
    };

    this.trackingService.getTrackingList(trackRequest).subscribe({
      next: (resultado: TrackingResponse[]) => {
        this.tracking = resultado;
        this.visibleTrack = true;
      },
      error: (err) => {
        console.error('Error al obtener tracking', err);
      }
    });
  }

  anularObservar(modo: 'ver' | 'anular' | 'observar', evento: string, id: number) {
    const obsRequest: ObservacionRequest = {
      solicitudId: id,
      codigoCliente: Number(this.idEmpresa)
    };

    this.observacionService.getObservacionList(obsRequest).subscribe({
      next: (resultado: ObservacionResponse[]) => {
        this.observaciones = resultado;
        this.visibleObservaciones = true;
        this.modoObservaciones = modo;
        this.idSolicitud = id;
        if (modo != 'ver') {
          this.eventoObservacion = evento;
        }
      },
      error: (err) => {
        console.error('Error al obtener observaciones', err);
      }
    });
  }

  cerrarObservaciones(){
    this.filtrar();
    this.visibleObservaciones = false;
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

    const payload: FlujoSolicitudRequest = {
      idSolicitud: id,
      flujo: this.modo,
      codigoCliente: Number(this.idEmpresa)
    };

    this.solicitudService.flujoSolicitudes(payload).subscribe({
      next: (resultado: number) => {
        const mensaje = this.modo === 'autorizar'
          ? `Se autorizó solicitud ${resultado} correctamente`
          : `Se ejecutó solicitud ${resultado} correctamente`;

        this.messageService.add({
          severity: 'success',
          summary: 'Confirmación',
          detail: mensaje,
        });

        this.filtrar();
      },
      error: (err) => {
        console.error('Error al autorizar solicitud', err);
      }
    });

    this.visibleFactor = false;
    this.solicitudSeleccionadaId = undefined;
  }

  private filtrarPorModo() {
    const estados = this.estadosPorModo[this.modo];
    if (estados?.length) {
      // @ts-ignore
      this.estadoSolicitudFiltrada = this.estadoSolicitud.filter(e => estados.includes(e.codigo));
      const preset = this.preselectPorModo[this.modo] ?? [];
      this.filtroForm.get('estado')?.setValue(preset);
    } else {
      this.estadoSolicitudFiltrada = this.estadoSolicitud;
      this.filtroForm.get('estado')?.setValue([]);
    }
  }

  private readonly estadosPorModo: Record<string, Estado[]> = {
    validar: ['REGISTRADO', 'VALIDADO', 'OBSERVADO', 'ANULADO'],
    autorizar: ['PENDIENTE_AUTORIZACION', 'AUTORIZADO_PARCIAL'],
    ejecutar: ['AUTORIZADO', 'PROCESADO_TOTAL', 'PROCESADO_PARCIAL']
  };

  private readonly preselectPorModo: Record<string, Estado[]> = {
    validar: ['REGISTRADO', 'VALIDADO'],
    autorizar: ['PENDIENTE_AUTORIZACION', 'AUTORIZADO_PARCIAL'],
    ejecutar: ['AUTORIZADO']
  };
}
