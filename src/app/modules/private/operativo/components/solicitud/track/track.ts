import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {
  TrackingResponse
} from '../../../../../../apis/model/module/private/operativo/solicitud/response/tracking-response';

type Evento = 'REGISTRADO_EXCEL' | 'REGISTRADO_JSON' | 'VALIDAR' | 'ENVIAR_AUTORIZACION' | 'AUTORIZAR' | 'EJECUTAR' | 'OBSERVAR' | 'ANULAR';

@Component({
  selector: 'app-track',
  imports: [
    Button,
    Dialog,
    TableModule,
  ],
  templateUrl: './track.html',
  styleUrl: './track.scss',
})
export class Track {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() trackList: TrackingResponse[] = [];

  protected cerrar() {
    this.visibleChange.emit(false);
  }

  eventoLabel(estado: Evento): string {
    switch (estado) {
      case 'REGISTRADO_EXCEL': return 'Registro excel';
      case 'REGISTRADO_JSON': return 'Registro desde origen del cliente';
      case 'VALIDAR': return 'Validado';
      case 'ENVIAR_AUTORIZACION': return 'Enviado a autorización';
      case 'AUTORIZAR': return 'Autorizado';
      case 'EJECUTAR': return 'Ejecutado';
      case 'OBSERVAR': return 'Observado';
      case 'ANULAR': return 'Anulado';
      default: return estado;
    }
  }
}
