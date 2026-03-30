import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {
  TrackingResponse
} from '../../../../../../apis/model/module/private/operativo/solicitud/response/tracking-response';

type Evento = 'REGISTRADO_EXCEL' | 'REGISTRADO_JSON' | 'VALIDAR' | 'ENVIAR_AUTORIZACION' | 'AUTORIZAR' | 'EJECUTAR';

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
export class Track implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() trackList: TrackingResponse[] = [];

  ngOnInit(): void {
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }

  eventoLabel(estado: Evento): string {
    switch (estado) {
      case 'REGISTRADO_EXCEL': return 'Registrado por excel';
      case 'REGISTRADO_JSON': return 'Registrado desde origen del cliente';
      case 'VALIDAR': return 'Validado';
      case 'ENVIAR_AUTORIZACION': return 'Enviado a autorización';
      case 'AUTORIZAR': return 'Autorizado';
      case 'EJECUTAR': return 'Ejecutado';
      default: return estado;
    }
  }
}
