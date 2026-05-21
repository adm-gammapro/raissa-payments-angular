import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {
  LiquidacionSolicitudResponse
} from '../../../../../../apis/model/module/private/operativo/solicitud/response/liquidacion-solicitud-response';
import {NumberFormatPipe} from '../../../../../../utils/pipes/number-format-pipe';
import {MonedaPipe} from '../../../../../../utils/pipes/moneda.pipe';

@Component({
  selector: 'app-liquidacion',
  imports: [
    Button,
    Dialog,
    TableModule,
    NumberFormatPipe,
    MonedaPipe
  ],
  templateUrl: './liquidacion.html',
  styleUrl: './liquidacion.css',
})
export class Liquidacion {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() liquidacion?: LiquidacionSolicitudResponse;

  protected cerrar() {
    this.visibleChange.emit(false);
  }
}
