import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {Panel} from "primeng/panel";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../../service/modules/private/operativo/administrativo/administrativo';
import {environment} from '../../../../../../../environments/environment';
import {
  ReglaResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/regla-response';
import {ReglaRequest} from '../../../../../../apis/model/module/private/operativo/administrativo/request/regla-request';
import {Select} from 'primeng/select';
import {Moneda} from '../../../../../../apis/model/module/commons/moneda';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-form-reglas',
  imports: [
    Button,
    Dialog,
    InputText,
    Message,
    Panel,
    ReactiveFormsModule,
    Select,
    InputNumber
  ],
  templateUrl: './form-reglas.html',
  styleUrl: './form-reglas.scss',
})
export class FormReglas {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modo: 'editar' | 'registrar' = 'registrar';
  @Output() guardarRegistro = new EventEmitter<void>();
  @Input() set reglaData(regla: ReglaResponse | null) {
    if (regla) {
      this.cargarDatosEnFormulario(regla);
    } else {
      this.limpiarFormulario();
    }
  }
  activate = signal(false);
  form!: FormGroup;
  codigoRegla!: number | null;
  protected idEmpresa!: string;
  protected monedas: Moneda[] = Moneda.monedas;

  constructor(private readonly fb: FormBuilder,
              private readonly messageService: MessageService,
              private readonly administrativoService: AdministrativoService) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }

    this.form = this.fb.group({
      codigo: [null],
      descripcion: ['', Validators.required],
      moneda: ['', Validators.required],
      limiteInferior: ['', Validators.required],
      limiteSuperior: ['', Validators.required],
    });
  }

  guardar() {
    if (this.form.valid) {
      const regla: ReglaRequest = {
        codigo: this.codigoRegla,
        descripcion: this.form.get('descripcion')?.value,
        moneda: this.form.get('moneda')?.value,
        limiteInferior: this.form.get('limiteInferior')?.value,
        limiteSuperior: this.form.get('limiteSuperior')?.value,
        codigoCliente: Number(this.idEmpresa)
      };

      if(this.modo == 'registrar') {
        this.administrativoService.createRegla(regla).subscribe({
          next: (response: ReglaResponse) => {
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
        this.administrativoService.updateRegla(regla).subscribe({
          next: (response: ReglaResponse) => {
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

  private cargarDatosEnFormulario(regla: ReglaResponse): void {
    this.form.patchValue({
      codigo: regla.codigo,
      descripcion: regla.descripcion,
      moneda: regla.moneda,
      limiteInferior: regla.limiteInferior,
      limiteSuperior: regla.limiteSuperior
    });

    // Si necesitas guardar el ID para edición
    if (regla.codigo) {
      // Puedes almacenar el ID en una propiedad del componente
      this.codigoRegla = regla.codigo;
    }
  }

  private limpiarFormulario(): void {
    this.form.reset();
    this.codigoRegla = null;
  }
}
