import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {Message} from 'primeng/message';
import {Panel} from 'primeng/panel';
import {Select} from 'primeng/select';
import {
  ReglaResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/regla-response';
import {MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../../service/modules/private/operativo/administrativo/administrativo';
import {environment} from '../../../../../../../environments/environment';
import {
  ConfiguracionReglasResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/configuracion-reglas-response';
import {
  ConfiguracionReglasRequest
} from '../../../../../../apis/model/module/private/operativo/administrativo/request/configuracion-reglas-request';
import {
  CategoriaResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/categoria-response';
import {Modo} from '../../../../../../apis/model/module/commons/modo';
import {ReglaRequest} from '../../../../../../apis/model/module/private/operativo/administrativo/request/regla-request';
import {
  CategoriaRequest
} from '../../../../../../apis/model/module/private/operativo/administrativo/request/categoria-request';
import {Predeterminado} from '../../../../../../apis/model/module/commons/predeterminado';

@Component({
  selector: 'app-form-configuracion-reglas',
  imports: [
    Button,
    Dialog,
    FormsModule,
    InputNumber,
    Message,
    Panel,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './form-configuracion-reglas.html',
  styleUrl: './form-configuracion-reglas.scss',
})
export class FormConfiguracionReglas implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modo: 'editar' | 'registrar' = 'registrar';
  @Output() guardarRegistro = new EventEmitter<void>();
  @Input() set configuracionData(configuracion: ConfiguracionReglasResponse | null) {
    if (configuracion) {
      this.cargarDatosEnFormulario(configuracion);
    } else {
      this.limpiarFormulario();
    }
  }
  activate = signal(false);
  form!: FormGroup;
  codigoConfiguracion!: number | null;
  protected idEmpresa!: string;
  protected reglas!: ReglaResponse[];
  protected categorias!: CategoriaResponse[];
  protected modos: Modo[] = Modo.modos;
  protected predeterminados: Predeterminado[] = Predeterminado.predeterminados;

  constructor(private readonly fb: FormBuilder,
              private readonly messageService: MessageService,
              private readonly administrativoService: AdministrativoService) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }

    this.form = this.fb.group({
      codigo: [null],
      codigoRegla: ['', Validators.required],
      codigoCategoria: ['', Validators.required],
      codigoModo: ['', Validators.required],
      predeterminado: ['', Validators.required],
      prioridad: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.getListReglas();
    this.getListCategorias();

    this.form.patchValue({
      prioridad: 1
    });
  }

  guardar() {
    if (this.form.valid) {
      const configuracion: ConfiguracionReglasRequest = {
        codigo: this.codigoConfiguracion,
        codigoRegla: this.form.get('codigoRegla')?.value,
        codigoCategoria: this.form.get('codigoCategoria')?.value,
        codigoModo: this.form.get('codigoModo')?.value,
        predeterminado: this.form.get('predeterminado')?.value,
        prioridad: this.form.get('prioridad')?.value,
        codigoCliente: Number(this.idEmpresa)
      };

      if(this.modo == 'registrar') {
        this.administrativoService.createConfiguracionRegla(configuracion).subscribe({
          next: (response: ConfiguracionReglasResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se registró correctamente',
            });

            this.guardarRegistro.emit();
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
      } else {
        this.administrativoService.updateConfiguracionRegla(configuracion).subscribe({
          next: (response: ConfiguracionReglasResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se actualizó registro correctamente',
            });

            this.guardarRegistro.emit();
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

      this.form.reset();
      this.visibleChange.emit(false);
    } else {
      this.form.markAllAsTouched();
      this.activate.set(true);

      setTimeout(() => {
        this.activate.set(false);
      }, 3500);
    }
  }

  protected cerrar() {
    this.form.reset();
    this.form.patchValue({
      prioridad: 1
    });
    this.visibleChange.emit(false);
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

  get headerTitle(): string {
    if (this.modo === 'editar') return 'Actualizar';
    if (this.modo === 'registrar') return 'Registrar';
    return 'Registrar';
  }

  private cargarDatosEnFormulario(configuracion: ConfiguracionReglasResponse): void {
    this.form.patchValue({
      codigo: configuracion.codigo,
      codigoRegla: configuracion.codigoRegla,
      codigoCategoria: configuracion.codigoCategoria,
      codigoModo: configuracion.codigoModo,
      predeterminado: configuracion.predeterminado,
      prioridad: configuracion.prioridad
    });

    // Si necesitas guardar el ID para edición
    if (configuracion.codigo) {
      // Puedes almacenar el ID en una propiedad del componente
      this.codigoConfiguracion = configuracion.codigo;
    }
  }

  private limpiarFormulario(): void {
    this.form.reset();
    this.codigoConfiguracion = null;
  }
}
