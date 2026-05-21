import {Component, OnInit, ViewChild} from '@angular/core';
import {Card} from 'primeng/card';
import {CommonModule} from '@angular/common';
import {BreadcrumbComponent} from '../../../commons/components/breadcrumb/breadcrumb.component';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {Table, TableLazyLoadEvent, TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {UsuarioSearch} from '../../../../../apis/model/module/private/admnistrativo/usuario/request/usuario-search';
import {
  UsuarioResponse
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-response';
import {UsuarioService} from '../../../../../service/modules/private/administrativo/usuario/usuario.service';
import {Util} from '../../../../../utils/util/util';
import {
  UsuarioSearchResponse
} from '../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-search-response';
import {FormUsuario} from '../../components/usuario/form-usuario/form-usuario';
import {environment} from '../../../../../../environments/environment';
import {EstadoRegistroLabelPipe} from '../../../../../utils/pipes/estado-registro-label.pipe';
import {TipoUsuarioLabelPipe} from '../../../../../utils/pipes/tipo-usuario-label.pipe';
import {ClaseUsuarioLabelPipe} from '../../../../../utils/pipes/clase-usuario-label.pipe';
import {Estado} from '../../../../../apis/model/module/commons/estado';
import {VincularUsuarioSistemas} from '../../components/usuario/vincular-usuario-sistemas/vincular-usuario-sistemas';
import {VincularUsuarioClientes} from '../../components/usuario/vincular-usuario-clientes/vincular-usuario-clientes';
import {VincularUsuarioPerfiles} from '../../components/usuario/vincular-usuario-perfiles/vincular-usuario-perfiles';
import {
  ListarConfiguracionesUsuario
} from '../../components/usuario/listar-configuraciones-usuario/listar-configuraciones-usuario';

@Component({
  selector: 'app-usuario',
  imports: [
    CommonModule,
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
    Card,
    FormUsuario,
    EstadoRegistroLabelPipe,
    TipoUsuarioLabelPipe,
    ClaseUsuarioLabelPipe,
    VincularUsuarioSistemas,
    VincularUsuarioClientes,
    VincularUsuarioPerfiles,
    ListarConfiguracionesUsuario,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {
  protected idEmpresa!: string;
  protected usuarios!: UsuarioResponse[];
  protected filtroForm: FormGroup;
  protected loading: boolean = false;
  protected totalRecords: number = 0;
  protected registrosMostrados = 0;
  protected estados: Estado[] = Estado.estados;
  visibleForm: boolean = false;
  modoUso: 'editar' | 'registrar' = 'registrar';
  selectedUsuario!: UsuarioResponse | null;
  @ViewChild('dt') dt!: Table;
  protected actualizacionManual: boolean = false;
  protected modalSistemasVisible = false;
  protected usuarioSeleccionadoId = 1;

  protected modalClientesVisible = false;
  protected usuarioSeleccionadoClienteId = 1;

  protected modalPerfilesVisible = false;
  protected usuarioSeleccionadoPerfilId = 1;

  protected modalConfiguracionesVisible = false;
  protected usuarioSeleccionadoConfigId = 1;
  protected usuarioSeleccionadoConfigNombre = '';

  protected misItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Usuarios' }
  ];

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly fb: FormBuilder,
    private readonly usuarioService: UsuarioService
  ) {
    const idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA);
    if (idEmpresa) {
      this.idEmpresa = idEmpresa;
    }

    this.filtroForm = this.fb.group({
      nombreUsuario: [''],
      estadoRegistro: ['S'],
      idEmpresa: [this.idEmpresa ? Number(this.idEmpresa) : null]
    });
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar() {
    this.actualizacionManual = true;
    this.loading = true;
    if (this.dt) {
      this.dt.reset();
      this.dt.rows = 5;
    }

    setTimeout(() => {
      const fakeLazyEvent: TableLazyLoadEvent = {
        first: 0,
        rows: 5,
        sortField: 'apePaterno',
        sortOrder: 3
      };
      this.actualizacionManual = false;
      this.loadLazy(fakeLazyEvent);
    }, 100);
  }

  loadLazy(event: TableLazyLoadEvent) {
    if (this.actualizacionManual) return;

    const firstValue = event.first ?? 0;
    const rowsValue = event.rows ?? 5;
    const { estadoRegistro, nombreUsuario, idEmpresa } = this.filtroForm.value;

    const request: UsuarioSearch = {
      page: Math.floor(firstValue / (rowsValue || 1)),
      size: rowsValue,
      sortField: event.sortField as string,
      sortOrder: Util.mapSortOrder(event.sortOrder),
      estadoRegistro: estadoRegistro || undefined,
      nombreUsuario: nombreUsuario || undefined,
      idEmpresa: idEmpresa || undefined
    };

    // Usando el método con el mismo patrón que listarReglaPage
    this.usuarioService.listarUsuariosPage(request).subscribe({
      next: (response: UsuarioSearchResponse) => {
        this.usuarios = response.list;
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
      nombreUsuario: '',
      estadoRegistro: 'S',
      idEmpresa: this.idEmpresa ? Number(this.idEmpresa) : null
    });
    this.filtrar();
  }

  protected nuevo() {
    this.selectedUsuario = null;
    this.modoUso = 'registrar';
    this.visibleForm = true;
  }

  protected editar(codigo: number) {
    // Usando el método con el mismo patrón que getRegla
    this.usuarioService.obtenerUsuario(codigo).subscribe({
      next: (response: UsuarioResponse) => {
        this.selectedUsuario = response;
        this.modoUso = 'editar';
        this.visibleForm = true;
      },
      error: (error) => {
        if (error.status === 502) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error en el servicio de usuarios'
          });
        } else if (error.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Servicio de usuarios no disponible'
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
      message: '¿Estás seguro de dar de baja este usuario?',
      header: 'Eliminar Usuario',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'success'
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger'
      },
      accept: () => {
        this.usuarioService.eliminarUsuario(codigo).subscribe({
          next: (response: UsuarioResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: `Se dio de baja el usuario ${response.username} correctamente`
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
      }
    });
  }

  protected abrirModalSistemas(idUsuario: number) {
    this.usuarioSeleccionadoId = idUsuario;
    this.modalSistemasVisible = true;
  }

  protected abrirModalClientes(idUsuario: number) {
    this.usuarioSeleccionadoClienteId = idUsuario;
    this.modalClientesVisible = true;
  }

  protected abrirModalPerfiles(idUsuario: number) {
    this.usuarioSeleccionadoPerfilId = idUsuario;
    this.modalPerfilesVisible = true;
  }

  protected abrirModalConfiguraciones(idUsuario: number, nombreUsuario: string) {
    this.usuarioSeleccionadoConfigId = idUsuario;
    this.usuarioSeleccionadoConfigNombre = nombreUsuario;
    this.modalConfiguracionesVisible = true;
  }
}
