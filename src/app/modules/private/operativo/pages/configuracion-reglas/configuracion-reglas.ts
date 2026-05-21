import {Component, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from '../../../commons/components/breadcrumb/breadcrumb.component';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IftaLabel} from 'primeng/iftalabel';
import {Select} from 'primeng/select';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {Estado} from '../../../../../apis/model/module/commons/estado';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../service/modules/private/operativo/administrativo/administrativo.service';
import {environment} from '../../../../../../environments/environment';
import {Util} from '../../../../../utils/util/util';
import {
  ConfiguracionReglasResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/configuracion-reglas-response';
import {
  ConfiguracionReglasSearch
} from '../../../../../apis/model/module/private/operativo/administrativo/request/configuracion-reglas-search';
import {
  ConfiguracionReglasConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/configuracion-reglas-connect-response';
import {
  ConfiguracionReglasRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/configuracion-reglas-request';
import {
  FormConfiguracionReglas
} from '../../components/configuracion-reglas/form-configuracion-reglas/form-configuracion-reglas';
import {Modo} from '../../../../../apis/model/module/commons/modo';
import {ReglaRequest} from '../../../../../apis/model/module/private/operativo/administrativo/request/regla-request';
import {ReglaResponse} from '../../../../../apis/model/module/private/operativo/administrativo/response/regla-response';
import {
  CategoriaResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/categoria-response';
import {
  CategoriaRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-request';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-configuracion-reglas',
  imports: [
    BreadcrumbComponent,
    Button,
    ConfirmDialog,
    FormsModule,
    IftaLabel,
    ReactiveFormsModule,
    Select,
    TableModule,
    Toast,
    Tooltip,
    FormConfiguracionReglas,
    Card
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './configuracion-reglas.html',
  styleUrl: './configuracion-reglas.css',
})
export class ConfiguracionReglas implements OnInit {
  protected idEmpresa!: string;
  protected configuraciones!: ConfiguracionReglasResponse[];
  protected filtroForm: FormGroup;
  protected loading: boolean = false;
  protected totalRecords: number = 0;
  protected registrosMostrados = 0;
  protected estados: Estado[] = Estado.estados;
  visibleForm: boolean = false;
  modoUso: 'editar' | 'registrar' = 'registrar';
  selectedConfiguracion!: ConfiguracionReglasResponse | null;
  @ViewChild('dt') dt!: Table;
  protected actualizacionManual: boolean = false;
  protected modos: Modo[] = Modo.modos;
  protected reglas: ReglaResponse[] = [];
  protected categorias: CategoriaResponse[] = [];

  protected misItems: MenuItem[] = [
    {icon: 'pi pi-home', route: '/dashboard'},
    {label: 'Configuración de reglas'}
  ];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly administrativoService: AdministrativoService,
  ) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }

    this.filtroForm = this.fb.group({
      codigoRegla: [null],
      codigoCategoria: [null],
      codigoModo: [''],
      estadoRegistro: ['S']
    });
  }

  ngOnInit() {
    this.getListReglas();
    this.getListCategorias();
  }

  filtrar() {
    this.actualizacionManual = true;
    this.loading = true;
    this.dt.reset();
    this.dt.rows = 5;

    setTimeout(() => {
      const fakeLazyEvent: TableLazyLoadEvent = {
        first: 0,
        rows: 5,
        sortField: 'id',
        sortOrder: 1

      };
      this.actualizacionManual = false;
      this.loadLazy(fakeLazyEvent);
    }, 1000);
  }

  loadLazy(event: TableLazyLoadEvent) {
    if(this.actualizacionManual) return;

    const firstValue = event.first ?? 0;
    const rowsValue = event.rows ?? 5;

    const { estadoRegistro, codigoRegla, codigoCategoria, codigoModo } = this.filtroForm.value;

    const request: ConfiguracionReglasSearch = {
      page: Math.floor(firstValue / (rowsValue || 1)),
      size: rowsValue,
      sortField: event.sortField as string,
      sortOrder: Util.mapSortOrder(event.sortOrder),
      codigoRegla: codigoRegla,
      codigoCategoria: codigoCategoria,
      codigoModo: codigoModo,
      estadoRegistro: estadoRegistro || undefined,
      codigoCliente: Number(this.idEmpresa)
    };

    this.administrativoService.listarConfiguracionReglaPage(request).subscribe({
      next: (response: ConfiguracionReglasConnectResponse) => {
        this.configuraciones = response.list;
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
      codigoRegla: null,
      codigoCategoria: null,
      codigoModo: '',
      estadoRegistro: 'S'
    });
    this.filtrar();
  }

  protected nuevo(){
    this.modoUso = 'registrar';
    this.visibleForm = true;
  }

  protected editar(codigo: number){
    const request: ConfiguracionReglasRequest = {
      codigo: codigo,
      codigoCliente: Number(this.idEmpresa),
    };

    this.administrativoService.getConfiguracionRegla(request).subscribe({
      next: (response: ConfiguracionReglasResponse) => {
        this.selectedConfiguracion = response;
        this.modoUso = 'editar';
        this.visibleForm = true;
      },
      error: (error) => {
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio de configuracion de reglas'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio de configuracion de reglas no disponible'
          });
        }
      }
    });
  }

  protected guardar() {
    this.filtrar();
  }

  protected delete(event: Event, codigo: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de dar de baja este registro?',
      header: 'Baja',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'success',
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        const configuracion: ConfiguracionReglasRequest = {
          codigo: codigo,
          codigoCliente: Number(this.idEmpresa)
        };

        this.administrativoService.deleteConfiguracionRegla(configuracion).subscribe({
          next: (response: ConfiguracionReglasResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se dió de baja el registro correctamente',
            });

            this.filtrar();
          },
          error: (error) => {
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
      },
    });
  }

  protected getListReglas(){
    const request: ReglaRequest = {
      codigoCliente: Number(this.idEmpresa),
    };

    this.administrativoService.listRegla(request).subscribe({
      next: (response: ReglaResponse[]) => {
        this.reglas = response;
      },
      error: (error) => {
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio de reglas'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio de reglas no disponible'
          });
        }
      }
    });
  }

  protected getListCategorias(){
    const request: CategoriaRequest = {
      codigoCliente: Number(this.idEmpresa),
    };

    this.administrativoService.listCategoria(request).subscribe({
      next: (response: CategoriaResponse[]) => {
        this.categorias = response;
      },
      error: (error) => {
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio de categorias'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio de categorias no disponible'
          });
        }
      }
    });
  }
}
