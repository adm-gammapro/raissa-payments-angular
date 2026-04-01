import {Component, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from '../../../administrativo/components/breadcrumb/breadcrumb.component';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {Estado} from '../../../../../apis/model/module/commons/estado';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../service/modules/private/operativo/administrativo/administrativo';
import {environment} from '../../../../../../environments/environment';
import {Util} from '../../../../../utils/util/util';
import {
  CategoriaResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/categoria-response';
import {
  CategoriaSearch
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-search';
import {
  CategoriaConnectResponse
} from '../../../../../apis/model/module/private/operativo/administrativo/response/categoria-connect-response';
import {
  CategoriaRequest
} from '../../../../../apis/model/module/private/operativo/administrativo/request/categoria-request';
import {FormCategorias} from '../../components/categorias/form-categorias/form-categorias';

@Component({
  selector: 'app-categorias',
  imports: [
    BreadcrumbComponent,
    Button,
    ConfirmDialog,
    IftaLabel,
    InputText,
    ReactiveFormsModule,
    Select,
    TableModule,
    Toast,
    Tooltip,
    FormCategorias
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss',
})
export class Categorias {
  protected idEmpresa!: string;
  protected categorias!: CategoriaResponse[];
  filtroForm: FormGroup;
  protected loading: boolean = false;
  protected totalRecords: number = 0;
  protected registrosMostrados = 0;
  estados: Estado[] = Estado.estados;
  visibleForm: boolean = false;
  modoUso: 'editar' | 'registrar' = 'registrar';
  selectedCategoria!: CategoriaResponse | null;
  @ViewChild('dt') dt!: Table;
  protected actualizacionManual: boolean = false;

  protected misItems: MenuItem[] = [
    {icon: 'pi pi-home', route: '/dashboard'},
    {label: 'Categorias'}
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
      descripcion: [''],
      estadoRegistro: ['S']
    });
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

    const { estadoRegistro, descripcion } = this.filtroForm.value;

    const request: CategoriaSearch = {
      page: Math.floor(firstValue / (rowsValue || 1)),
      size: rowsValue,
      sortField: event.sortField as string,
      sortOrder: Util.mapSortOrder(event.sortOrder),
      descripcion: descripcion,
      estadoRegistro: estadoRegistro || undefined,
      codigoCliente: Number(this.idEmpresa)
    };

    this.administrativoService.listarCategoriaPage(request).subscribe({
      next: (response: CategoriaConnectResponse) => {
        this.categorias = response.list;
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
      descripcion: '',
      estadoRegistro: 'S'
    });
    this.filtrar();
  }

  protected nuevo(){
    this.modoUso = 'registrar';
    this.visibleForm = true;
  }

  protected editar(codigo: number){
    const request: CategoriaRequest = {
      codigo: codigo,
      descripcion: '',
      codigoCliente: Number(this.idEmpresa),
    };

    this.administrativoService.getCategoria(request).subscribe({
      next: (response: CategoriaResponse) => {
        this.selectedCategoria = response;
        this.modoUso = 'editar';
        this.visibleForm = true;
      },
      error: (error) => {
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio de países'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio de países no disponible'
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
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        const categoria: CategoriaRequest = {
          codigo: codigo,
          descripcion: '',
          codigoCliente: Number(this.idEmpresa)
        };

        this.administrativoService.deleteCategoria(categoria).subscribe({
          next: (response: CategoriaResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se dió de baja el registro ' + response.descripcion + ' correctamente',
            });

            this.filtrar();
          },
          error: (error) => {
            if (error.status === 502) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error en el servicio de países'
              });
            } else if (error.status === 503) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Servicio de países no disponible'
              });
            }
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelación',
          detail: 'No se dió de baja el registro',
        });
      },
    });
  }
}
