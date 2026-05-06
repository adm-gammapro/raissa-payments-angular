import {Component} from '@angular/core';
import {TableLazyLoadEvent, TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {BreadcrumbComponent} from '../../../administrativo/components/breadcrumb/breadcrumb.component';
import {ButtonModule} from 'primeng/button';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule} from 'primeng/select';
import {ToastModule} from 'primeng/toast';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {BadgeModule} from 'primeng/badge';
import {DatePickerModule} from 'primeng/datepicker';
import {VistaPreviaSolicitud} from '../../components/cargar-solicitud/vista-previa-solicitud/vista-previa-solicitud';
import {SolicitudService} from '../../../../../service/modules/private/operativo/solicitud/solicitud';
import {
  SolicitudResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/solicitud-response';
import {SolicitudSearch} from '../../../../../apis/model/module/private/operativo/solicitud/request/solicitud-search';
import {EstadoSolicitudEnum} from '../../../../../apis/model/emuns/estado-solicitud-enum';
import {
  SolicitudSearchResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/solicitud-search-response';
import {environment} from '../../../../../../environments/environment';
import {DetalleSolicitud} from '../../components/solicitud/detalle-solicitud/detalle-solicitud';
import {
  CargoSolicitudResponse
} from '../../../../../apis/model/module/private/operativo/solicitud/response/cargo-solicitud-response';
import {Util} from '../../../../../utils/util/util';
import {IftaLabel} from 'primeng/iftalabel';
import {Card} from 'primeng/card';

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
    DatePickerModule,
    VistaPreviaSolicitud,
    DetalleSolicitud,
    FormsModule,
    IftaLabel,
    Card,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './cargar-solicitud.html',
  styleUrl: './cargar-solicitud.css',
})
export class CargarSolicitud {
  protected visibleVistaPrevia: boolean = false;
  protected first = 0;
  protected loading: boolean = false;
  protected visibleDetalle: boolean = false;
  protected totalRecords: number = 0;
  protected registrosMostrados = 0;
  protected filtroForm: FormGroup;
  protected solicitudes!: SolicitudResponse[];
  protected idEmpresa: string = "";
  protected cargosSolicitud!: CargoSolicitudResponse[];

  protected misItems: MenuItem[] = [
    {icon: 'pi pi-home', route: '/dashboard'},
    {label: 'Cargar solicitudes'}
  ];

  constructor(
    private readonly messageService: MessageService,
    private readonly solicitudService: SolicitudService,
    private readonly fb: FormBuilder,
  ) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }

    this.filtroForm = this.fb.group({
      codigoSolicitud: [''],
      usuarioCarga: [''],
      fecha: [null as Date[] | null],
    });
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

    const { codigoSolicitud, usuarioCarga, fecha } = this.filtroForm.value;
    let fechaInicial: string | undefined = undefined;
    let fechaFinal: string | undefined = undefined;

    if (Array.isArray(fecha) && fecha[0]) {
      fechaInicial = Util.formatDate(fecha[0]);

      if (fecha[1]) {
        fechaFinal = Util.formatDate(fecha[1]);
      }
    }

    const request: SolicitudSearch = {
      page: Math.floor(firstValue / (rowsValue || 1)),
      size: rowsValue,
      sortField: event.sortField as string,
      sortOrder: Util.mapSortOrder(event.sortOrder),
      usuario: usuarioCarga || undefined,
      fechaInicial: fechaInicial || undefined,
      fechaFinal: fechaFinal || undefined,
      codigo: codigoSolicitud || undefined,
      estadoSolicitud: EstadoSolicitudEnum.REGISTRADO ? [EstadoSolicitudEnum.REGISTRADO] : undefined,
      codigoCliente: this.idEmpresa
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

  detalle(cargos: CargoSolicitudResponse[]) {
    this.visibleDetalle = true;
    this.cargosSolicitud = cargos;
  }

  abrirVistaPrevia() {
    this.visibleVistaPrevia = true;
  }
}
