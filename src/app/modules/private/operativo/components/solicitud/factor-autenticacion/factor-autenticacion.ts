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
  ],
  providers: [MessageService],
  templateUrl: './factor-autenticacion.html',
  styleUrl: './factor-autenticacion.scss',
})
export class FactorAutenticacion implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() autenticado = new EventEmitter<void>();
  selectedCategory: any = null;
  form!: FormGroup;
  value : any
  otpEnabled = false;
  otpLength = 4;

  categories: any[] = [
    {name: 'Enviar SMS', key: 'A'},
    {name: 'Mensaje vía Whatsapp', key: 'M'},
    {name: 'Correo electrónico', key: 'P'},
    {name: 'Google Authenticator', key: 'R'}
  ];

  constructor(private readonly fb: FormBuilder,
              private readonly messageService: MessageService) {}

  ngOnInit(): void {
    this.selectedCategory = this.categories[1];

    this.form = this.fb.group({
      category: ['', Validators.required],
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected cerrar() {
    this.visibleChange.emit(false);
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

    this.otpEnabled = true;
    this.value = '';
  }

  autenticar() {
    if (!this.otpComplete) return;

    this.autenticado.emit();   // avisa al padre
    this.cerrar();             // cierra el diálogo
  }

  get otpComplete(): boolean {
    return this.value?.length === this.otpLength;
  }
}
