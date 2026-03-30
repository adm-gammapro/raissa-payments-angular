import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {Dialog} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  CargoSolicitudResponse
} from '../../../../../../apis/model/module/private/operativo/solicitud/response/cargo-solicitud-response';

@Component({
  selector: 'app-detalle-solicitud',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    MessageModule,
    TableModule,
    TagModule
  ],
  templateUrl: './detalle-solicitud.html',
  styleUrl: './detalle-solicitud.scss',
})
export class DetalleSolicitud implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() mostrar: boolean = false;
  @Input() cargos: CargoSolicitudResponse[] = [];
  expandedRows: Record<string, boolean> = {};

  ngOnInit() {
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }

  protected expandAll() {
    this.expandedRows = this.cargos.reduce((acc, c) => ({ ...acc, [c.id]: true }), {});
  }

  protected collapseAll() {
    this.expandedRows = {};
  }

  protected monedaSeverity(moneda: 'PEN' | 'USD') {
    return moneda === 'PEN' ? 'info' : 'success';
  }

  protected toNumber(monto: string) {
    return Number(monto.replace(/,/g, ''));
  }

  protected totalAbonos(cargo: CargoSolicitudResponse) {
    return cargo.abonos.reduce((s, d) => s + d.montoDestino, 0);
  }

  protected formatMonto(monto: number, moneda: 'PEN' | 'USD') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2
    }).format(monto);
  }

  protected tagSeverity(cargo: CargoSolicitudResponse): 'success' | 'danger' {
    const total = cargo.montoTotalAbonos;
    const cargoMonto = cargo.montoCargo;
    return total === cargoMonto ? 'success' : 'danger';
  }
}
