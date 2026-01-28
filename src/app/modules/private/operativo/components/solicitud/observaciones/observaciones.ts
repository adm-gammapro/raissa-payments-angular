import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

interface Observacion {
  descripcion: string;
  fecha: string;
  usuarioReg: string;
  evento: string;
}

@Component({
  selector: 'app-observaciones',
  imports: [
    Dialog,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    TableModule,
    CardModule,
    TextareaModule,
    ReactiveFormsModule
  ],
  templateUrl: './observaciones.html',
  styleUrl: './observaciones.scss',
})
export class Observaciones implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  protected observaciones: Observacion[] = [];
  protected formGroup!: FormGroup;
  @Input() modo: 'ver' | 'anular' | 'observar' = 'ver';

  ngOnInit(): void {
    this.observaciones = [
      { descripcion: 'Revisión inicial del expediente', fecha: '2024-12-01 10:30', usuarioReg: 'jrodriguez', evento: 'Ejecución' },
      { descripcion: 'Se solicitó documentación adicional', fecha: '2024-12-02 14:15', usuarioReg: 'mlopez', evento: 'Autorización' },
      { descripcion: 'Documentos recibidos y validados', fecha: '2024-12-03 09:05', usuarioReg: 'acarvajal', evento: 'Anulación' },
    ];

    this.formGroup = new FormGroup({
      text: new FormControl<string | null>(null)
    });
  }

  get headerTitle(): string {
    if (this.modo === 'ver') return 'Observaciones';
    if (this.modo === 'anular') return 'Anulación';
    return 'Ingresar Observación';
  }

  get cardTitle(): string {
    if (this.modo === 'anular') return 'Ingrese detalle de anulación';
    if (this.modo === 'observar') return 'Ingrese detalle de observación';
    return '';
  }

  get showCard(): boolean {
    return this.modo !== 'ver';
  }

  get showBtnAnular(): boolean {
    return this.modo === 'anular';
  }

  get showBtnObservar(): boolean {
    return this.modo === 'observar';
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }
}
