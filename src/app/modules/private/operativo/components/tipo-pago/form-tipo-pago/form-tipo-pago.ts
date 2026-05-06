import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {Panel} from "primeng/panel";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from 'primeng/api';
import {
  TipoPagoResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/tipo-pago-response';
import {Message} from 'primeng/message';
import {AdministrativoService} from '../../../../../../service/modules/private/operativo/administrativo/administrativo';
import {
  TipoPagoRequest
} from '../../../../../../apis/model/module/private/operativo/administrativo/request/tipo-pago-request';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'app-form-tipo-pago',
  imports: [
    Button,
    Dialog,
    InputText,
    Panel,
    ReactiveFormsModule,
    Message,
    CommonModule
  ],
  templateUrl: './form-tipo-pago.html',
  styleUrl: './form-tipo-pago.css',
})
export class FormTipoPago {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modo: 'editar' | 'registrar' = 'registrar';
  @Output() guardarRegistro = new EventEmitter<void>();
  @Input() set tipoPagoData(tipoPago: TipoPagoResponse | null) {
    if (tipoPago) {
      this.cargarDatosEnFormulario(tipoPago);
    } else {
      this.limpiarFormulario();
    }
  }
  activate = signal(false);
  form!: FormGroup;
  codigoTipoPago!: number | null;
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
      const tipoPago: TipoPagoRequest = {
        codigo: this.codigoTipoPago,
        descripcion: this.form.get('descripcion')?.value,
        codigoCliente: Number(this.idEmpresa)
      };

      if(this.modo == 'registrar') {
        this.administrativoService.createTipoPago(tipoPago).subscribe({
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
        this.administrativoService.updateTipoPago(tipoPago).subscribe({
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

  private cargarDatosEnFormulario(tipoPago: TipoPagoResponse): void {
    this.form.patchValue({
      codigo: tipoPago.codigo,
      descripcion: tipoPago.descripcion
    });

    // Si necesitas guardar el ID para edición
    if (tipoPago.codigo) {
      // Puedes almacenar el ID en una propiedad del componente
      this.codigoTipoPago = tipoPago.codigo;
    }
  }

  private limpiarFormulario(): void {
    this.form.reset();
    this.codigoTipoPago = null;
  }
}
