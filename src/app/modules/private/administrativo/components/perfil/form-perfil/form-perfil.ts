import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {
  PerfilResponse
} from '../../../../../../apis/model/module/private/admnistrativo/perfil/response/perfil-response';
import {CommonModule} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Panel} from 'primeng/panel';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PerfilRequest} from '../../../../../../apis/model/module/private/admnistrativo/perfil/request/perfil-request';
import {environment} from '../../../../../../../environments/environment';
import {MessageService} from 'primeng/api';
import {PerfilService} from '../../../../../../service/modules/private/administrativo/perfil/perfil.service';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-form-perfil',
  imports: [
    CommonModule,
    Dialog,
    Button,
    InputText,
    Message,
    Panel,
    ReactiveFormsModule,
    DatePicker
  ],
  templateUrl: './form-perfil.html',
  styleUrl: './form-perfil.css',
})
export class FormPerfil implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() modo: 'editar' | 'registrar' = 'registrar';
  @Output() guardarRegistro = new EventEmitter<void>();

  private _perfilData: PerfilResponse | null = null;

  @Input() set perfilData(perfil: PerfilResponse | null) {
    if (perfil) {
      this.cargarDatosEnFormulario(perfil);
    } else {
      this.limpiarFormulario();
    }
  }

  activate = signal(false);
  form!: FormGroup;
  protected idEmpresa!: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly perfilService: PerfilService
  ) {
    const idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA);
    if (idEmpresa) {
      this.idEmpresa = idEmpresa;
    }

    this.form = this.fb.group({
      codigo: [null],
      descripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      abreviatura: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[A-Z0-9_]+$')]],
      nombreComercial: ['', Validators.maxLength(100)],
      fechaCaducidad: [null]
    });
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  guardar() {
    if (this.form.valid) {
      const fechaCaducidad = this.form.get('fechaCaducidad')?.value;
      const request: PerfilRequest = {
        codigo: this.form.get('codigo')?.value,
        descripcion: this.form.get('descripcion')?.value,
        abreviatura: this.form.get('abreviatura')?.value,
        nombreComercial: this.form.get('nombreComercial')?.value,
        fechaCaducidad: fechaCaducidad ? this.formatDate(fechaCaducidad) : undefined,
        codigoCliente: Number(this.idEmpresa)
      };

      if (this.modo === 'registrar') {
        this.perfilService.registrarPerfil(request).subscribe({
          next: (response: PerfilResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: `Se registró el perfil ${response.descripcion} correctamente`
            });
            this.guardarRegistro.emit();
            this.cerrar();
          },
          error: (error) => this.handleError(error)
        });
      } else {
        this.perfilService.actualizarPerfil(request).subscribe({
          next: (response: PerfilResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmación',
              detail: `Se actualizó el perfil ${response.descripcion} correctamente`
            });
            this.guardarRegistro.emit();
            this.cerrar();
          },
          error: (error) => this.handleError(error)
        });
      }
    } else {
      this.form.markAllAsTouched();
      this.activate.set(true);
      setTimeout(() => {
        this.activate.set(false);
      }, 3500);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private handleError(error: any): void {
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
    } else if (error.status === 400) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: error.error?.message || 'Datos inválidos'
      });
    }
  }

  protected cerrar() {
    this.form.reset();
    this.visibleChange.emit(false);
    this.limpiarFormulario();
  }

  get headerTitle(): string {
    return this.modo === 'editar' ? 'Actualizar Perfil' : 'Registrar Perfil';
  }

  private cargarDatosEnFormulario(perfil: PerfilResponse): void {
    let fechaCaducidad: Date | null = null;
    if (perfil.fechaCaducidad) {
      fechaCaducidad = new Date(perfil.fechaCaducidad);
    }

    this.form.patchValue({
      codigo: perfil.codigo,
      descripcion: perfil.descripcion,
      abreviatura: perfil.abreviatura,
      nombreComercial: perfil.nombreComercial,
      fechaCaducidad: fechaCaducidad
    });
  }

  private limpiarFormulario(): void {
    this.form.reset({
      codigo: null,
      descripcion: '',
      abreviatura: '',
      nombreComercial: '',
      fechaCaducidad: null
    });
  }
}
