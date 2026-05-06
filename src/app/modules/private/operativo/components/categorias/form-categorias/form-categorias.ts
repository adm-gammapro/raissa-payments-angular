import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {Panel} from "primeng/panel";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  TipoPagoResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/tipo-pago-response';
import {MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../../service/modules/private/operativo/administrativo/administrativo';
import {environment} from '../../../../../../../environments/environment';
import {
  CategoriaResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/categoria-response';
import {
  CategoriaRequest
} from '../../../../../../apis/model/module/private/operativo/administrativo/request/categoria-request';

@Component({
  selector: 'app-form-categorias',
    imports: [
        Button,
        Dialog,
        InputText,
        Message,
        Panel,
        ReactiveFormsModule
    ],
  templateUrl: './form-categorias.html',
  styleUrl: './form-categorias.scss',
})
export class FormCategorias {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modo: 'editar' | 'registrar' = 'registrar';
  @Output() guardarRegistro = new EventEmitter<void>();
  @Input() set categoriaData(categoria: CategoriaResponse | null) {
    if (categoria) {
      this.cargarDatosEnFormulario(categoria);
    } else {
      this.limpiarFormulario();
    }
  }
  activate = signal(false);
  form!: FormGroup;
  codigoCategoria!: number | null;
  protected idEmpresa!: string;

  constructor(private readonly fb: FormBuilder,
              private readonly messageService: MessageService,
              private readonly administrativoService: AdministrativoService) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }

    this.form = this.fb.group({
      codigo: [null],
      descripcion: ['', Validators.required],
    });
  }

  guardar() {
    if (this.form.valid) {
      const categoria: CategoriaRequest = {
        codigo: this.codigoCategoria,
        descripcion: this.form.get('descripcion')?.value,
        codigoCliente: Number(this.idEmpresa)
      };

      if(this.modo == 'registrar') {
        this.administrativoService.createCategoria(categoria).subscribe({
          next: (response: TipoPagoResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se registró ' + response.descripcion + ' correctamente',
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
        this.administrativoService.updateCategoria(categoria).subscribe({
          next: (response: TipoPagoResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: 'Se actualizó registro ' + response.descripcion + ' correctamente',
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
    this.visibleChange.emit(false);
  }

  get headerTitle(): string {
    if (this.modo === 'editar') return 'Actualizar';
    if (this.modo === 'registrar') return 'Registrar';
    return 'Registrar';
  }

  private cargarDatosEnFormulario(categoria: CategoriaResponse): void {
    this.form.patchValue({
      codigo: categoria.codigo,
      descripcion: categoria.descripcion
    });

    // Si necesitas guardar el ID para edición
    if (categoria.codigo) {
      // Puedes almacenar el ID en una propiedad del componente
      this.codigoCategoria = categoria.codigo;
    }
  }

  private limpiarFormulario(): void {
    this.form.reset();
    this.codigoCategoria = null;
  }
}
