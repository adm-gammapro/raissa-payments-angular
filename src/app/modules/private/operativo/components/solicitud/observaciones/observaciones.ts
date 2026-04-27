import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {AvatarModule} from 'primeng/avatar';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {TextareaModule} from 'primeng/textarea';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  ObservacionResponse
} from '../../../../../../apis/model/module/private/operativo/solicitud/response/observacion-response';
import {MessageService} from 'primeng/api';
import {environment} from '../../../../../../../environments/environment';
import {SolicitudService} from '../../../../../../service/modules/private/operativo/solicitud/solicitud';
import {
  ObservacionFlujoSolicitudRequest
} from '../../../../../../apis/model/module/private/operativo/solicitud/request/observacion-flujo-solicitud-request';

type Evento = 'REGISTRADO_EXCEL' | 'REGISTRADO_JSON' | 'VALIDAR' | 'ENVIAR_AUTORIZACION' | 'AUTORIZAR' | 'EJECUTAR';

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
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './observaciones.html',
  styleUrl: './observaciones.scss',
})
export class Observaciones implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() obsList: ObservacionResponse[] = [];
  @Input() idSolicitud!: number;
  protected formGroup!: FormGroup;
  @Input() modo: 'ver' | 'anular' | 'observar' = 'ver';
  protected idEmpresa: string = "";
  protected descripcion: string = "";
  @Input() eventoObservacion!: string;
  @Output() cerrarObservaciones = new EventEmitter<void>();

  eventoLabel(estado: Evento): string {
    switch (estado) {
      case 'REGISTRADO_EXCEL': return 'Registrado por excel';
      case 'REGISTRADO_JSON': return 'Registrado desde origen del cliente';
      case 'VALIDAR': return 'Validar';
      case 'ENVIAR_AUTORIZACION': return 'Enviar a autorización';
      case 'AUTORIZAR': return 'Autorizar';
      case 'EJECUTAR': return 'Ejecutar';
      default: return estado;
    }
  }

  constructor(
    private readonly messageService: MessageService,
    private readonly solicitudService: SolicitudService
  ) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }
  }

  ngOnInit(): void {
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

  protected observarAnular(flujo: string) {
    const payload: ObservacionFlujoSolicitudRequest = {
      idSolicitud: this.idSolicitud,
      flujo: flujo,
      descripcionObservacion: this.descripcion,
      eventoObservacion: this.eventoObservacion,
      codigoCliente: Number(this.idEmpresa)
    };

    this.solicitudService.observacionFlujoSolicitudes(payload).subscribe({
      next: (resultado: number) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmación',
          detail: 'Se registró observación para solicitud ' + resultado + ' correctamente',
        });
        this.descripcion = "";
        this.cerrarObservaciones.emit();
      },
      error: (err) => {
        console.error('Error al registrar observacion', err);
      }
    });

    this.cerrar();
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }
}
