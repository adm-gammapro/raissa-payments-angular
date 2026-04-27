import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dialog} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {RadioButton} from 'primeng/radiobutton';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import {InputText} from 'primeng/inputtext';
import { InputOtp } from 'primeng/inputotp';
import {Tooltip} from 'primeng/tooltip';
import {MessageService} from 'primeng/api';
import {GeneralService} from '../../../../../../service/commons/general';
import {environment} from '../../../../../../../environments/environment';
import { ProgressSpinner } from 'primeng/progressspinner';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-factor-autenticacion',
  imports: [
    Dialog,
    TableModule,
    RadioButton,
    CommonModule,
    FormsModule,
    PanelModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    ReactiveFormsModule,
    InputText,
    InputOtp,
    Tooltip,
    Toast,
    ProgressSpinner
  ],
  providers: [MessageService],
  templateUrl: './factor-autenticacion.html',
  styleUrl: './factor-autenticacion.scss',
})
export class FactorAutenticacion implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() autenticado = new EventEmitter<void>();
  form!: FormGroup;
  value : any
  otpEnabled = false;
  otpLength = 6;
  protected username: string = '';
  protected codigoAutenticacion: string = '';
  protected loading = false;

  categories: any[] = [
    {name: 'Enviar SMS', key: 'sms'},
    {name: 'Mensaje vía Whatsapp', key: 'ws'},
    {name: 'Correo electrónico', key: 'email'},
    {name: 'Google Authenticator', key: 'auth'}
  ];

  constructor(private readonly fb: FormBuilder,
              private readonly messageService: MessageService,
              private readonly generalService: GeneralService) {
    if (sessionStorage.getItem(environment.session.USERNAME) != undefined) {
      this.username = sessionStorage.getItem(environment.session.USERNAME)!;
    }
  }

  ngOnInit(): void {
    const defaultCategory = this.categories.find(c => c.key === 'email');

    this.form = this.fb.group({
      category: [defaultCategory, Validators.required],
      usuario: [this.username, Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

  }

  protected cerrar() {
    this.visibleChange.emit(false);
    this.resetForm();
  }

  protected solicitar() {
    const catCtrl = this.form.get('category');
    const userCtrl = this.form.get('usuario');
    const passCtrl = this.form.get('password');

    if (!catCtrl?.value) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar medio de autenticación' });
      catCtrl?.markAsTouched();
      return;
    }

    if (userCtrl?.invalid || passCtrl?.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe completar datos de autenticación' });
      userCtrl?.markAsTouched();
      passCtrl?.markAsTouched();
      return;
    }

    this.loading = true;

    const { usuario, password, category } = this.form.value;

    this.generalService.getCodigoRandom(usuario,
                                        password,
                                        category.key).subscribe({
      next: (response) => {
        if (response == "") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Validación',
            detail: 'No se puedo autenticar las credenciales',
          });
        } else if (response == "-") {
          this.messageService.add({
            severity: 'warn',
            summary: 'Validación',
            detail: 'Medio de autenticación no disponible',
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmación',
            detail: 'Ingrese codigo enviado',
          });
          this.otpEnabled = true;
          this.value = '';
          this.codigoAutenticacion= response;
        }

        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener codigo'
        });

        this.loading = false;
      }
    });
  }

  autenticar() {
    if (!this.otpComplete) return;
    const valorOtp = this.value?.toString().trim();

    if (valorOtp !== this.codigoAutenticacion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Código incorrecto'
      });

      this.value = '';
      this.otpEnabled = false;
      return;
    }

    this.codigoAutenticacion = '';
    this.autenticado.emit();
    this.cerrar();
  }

  get otpComplete(): boolean {
    return this.value?.length === this.otpLength;
  }

  resetForm() {
    const defaultCategory = this.categories.find(c => c.key === 'email');

    this.form.reset({
      category: defaultCategory,
      usuario: this.username,
      password: ''
    });

    this.codigoAutenticacion = '';
    this.value = '';
    this.otpEnabled = false;
  }
}
