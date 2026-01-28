import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {Dialog} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {TableModule} from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface DetalleAbono {
  id: string;
  cuentaAbono: string;
  entidadFinancieraAbono: string;
  monedaCuentaAbono: 'PEN' | 'USD';
  montoAbono: string;
  cliente: string;
  estadoEjecucion: string;
  detalleEjecucion: string;
}

interface Cargo {
  id: string;
  cuentaCargo: string;
  entidadFinancieraCargo: string;
  monedaCuentaCargo: 'PEN' | 'USD';
  montoCargo: string;
  detalle: DetalleAbono[];
  estadoEjecucion: string;
}

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
  cargos: Cargo[] = [];
  expandedRows: Record<string, boolean> = {};

  ngOnInit() {
    this.cargos = [
      {
        id: '1',
        cuentaCargo: '1931441760141',
        entidadFinancieraCargo: 'ALFIN Banco',
        monedaCuentaCargo: 'PEN',
        montoCargo: '120,000.00',
        detalle: [
          { id: '1', cuentaAbono: '001104860100193411', entidadFinancieraAbono: 'BBVA Continental', monedaCuentaAbono: 'PEN', montoAbono: '60,000.00', cliente: 'David James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '2', cuentaAbono: '001104860100193412', entidadFinancieraAbono: 'Interbank',        monedaCuentaAbono: 'PEN', montoAbono: '30,000.00', cliente: 'David xxx James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '3', cuentaAbono: '001104860100193413', entidadFinancieraAbono: 'Banco de crédito dle perú', monedaCuentaAbono: 'PEN', montoAbono: '10,000.00', cliente: 'David yyy James', estadoEjecucion:'Incorrecto', detalleEjecucion: 'Cuenta de destino no disponible' },
          { id: '4', cuentaAbono: '001104860100193414', entidadFinancieraAbono: 'Scotiabank',       monedaCuentaAbono: 'PEN', montoAbono: '20,000.00', cliente: 'David zzz James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
        ],
        estadoEjecucion:'Incorrecto'
      },
      {
        id: '2',
        cuentaCargo: '1931441760143',
        entidadFinancieraCargo: 'ALFIN Banco',
        monedaCuentaCargo: 'USD',
        montoCargo: '180,000.00',
        detalle: [
          { id: '5', cuentaAbono: '001104860100193411', entidadFinancieraAbono: 'BBVA Continental', monedaCuentaAbono: 'USD', montoAbono: '70,000.00', cliente: 'David James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '6', cuentaAbono: '001104860100193412', entidadFinancieraAbono: 'Interbank',        monedaCuentaAbono: 'USD', montoAbono: '40,000.00', cliente: 'David xxx James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '7', cuentaAbono: '001104860100193413', entidadFinancieraAbono: 'Banco de crédito dle perú', monedaCuentaAbono: 'USD', montoAbono: '50,000.00', cliente: 'David yyy James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '8', cuentaAbono: '001104860100193414', entidadFinancieraAbono: 'Scotiabank',       monedaCuentaAbono: 'USD', montoAbono: '30,000.00', cliente: 'David zzz James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
        ],
        estadoEjecucion:'Correcto'
      },
      {
        id: '3',
        cuentaCargo: '1931441760160',
        entidadFinancieraCargo: 'BBVA Continental',
        monedaCuentaCargo: 'PEN',
        montoCargo: '130,000.00',
        detalle: [
          { id: '9',  cuentaAbono: '001104860100193411', entidadFinancieraAbono: 'Banco pichincha', monedaCuentaAbono: 'PEN', montoAbono: '40,000.00', cliente: 'David James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '10', cuentaAbono: '001104860100193412', entidadFinancieraAbono: 'Interbank',       monedaCuentaAbono: 'PEN', montoAbono: '20,000.00', cliente: 'David xxx James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '11', cuentaAbono: '001104860100193413', entidadFinancieraAbono: 'Banco de crédito dle perú', monedaCuentaAbono: 'PEN', montoAbono: '60,000.00', cliente: 'David yyy James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '12', cuentaAbono: '001104860100193414', entidadFinancieraAbono: 'Scotiabank',      monedaCuentaAbono: 'PEN', montoAbono: '10,000.00', cliente: 'David zzz James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
        ],
        estadoEjecucion:'Correcto'
      },
      {
        id: '4',
        cuentaCargo: '1931441760150',
        entidadFinancieraCargo: 'BBVA Continental',
        monedaCuentaCargo: 'USD',
        montoCargo: '200,000.00',
        detalle: [
          { id: '13', cuentaAbono: '001104860100193411', entidadFinancieraAbono: 'BBVA Continental', monedaCuentaAbono: 'USD', montoAbono: '55,000.00', cliente: 'David James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '14', cuentaAbono: '001104860100193412', entidadFinancieraAbono: 'Interbank',       monedaCuentaAbono: 'USD', montoAbono: '45,000.00', cliente: 'David xxx James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '15', cuentaAbono: '001104860100193413', entidadFinancieraAbono: 'Banco de crédito dle perú', monedaCuentaAbono: 'USD', montoAbono: '80,000.00', cliente: 'David yyy James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '16', cuentaAbono: '001104860100193414', entidadFinancieraAbono: 'Scotiabank',      monedaCuentaAbono: 'USD', montoAbono: '20,000.00', cliente: 'David zzz James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
        ],
        estadoEjecucion:'Correcto'
      },
      {
        id: '5',
        cuentaCargo: '1931441760150',
        entidadFinancieraCargo: 'Banco de credito del peru',
        monedaCuentaCargo: 'USD',
        montoCargo: '250,000.00',
        detalle: [
          { id: '17', cuentaAbono: '001104860100193411', entidadFinancieraAbono: 'BBVA Continental', monedaCuentaAbono: 'USD', montoAbono: '85,000.00', cliente: 'David James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '18', cuentaAbono: '001104860100193412', entidadFinancieraAbono: 'Interbank',       monedaCuentaAbono: 'USD', montoAbono: '15,000.00', cliente: 'David xxx James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '19', cuentaAbono: '001104860100193413', entidadFinancieraAbono: 'Banco de crédito dle perú', monedaCuentaAbono: 'USD', montoAbono: '100,000.00', cliente: 'David yyy James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
          { id: '20', cuentaAbono: '001104860100193414', entidadFinancieraAbono: 'Scotiabank',      monedaCuentaAbono: 'USD', montoAbono: '50,000.00', cliente: 'David zzz James', estadoEjecucion:'Correcto', detalleEjecucion: 'Correcto' },
        ],
        estadoEjecucion:'Correcto'
      }
    ];
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

  protected totalAbonos(cargo: Cargo) {
    return cargo.detalle.reduce((s, d) => s + this.toNumber(d.montoAbono), 0);
  }

  protected formatMonto(monto: number, moneda: 'PEN' | 'USD') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2
    }).format(monto);
  }

  protected tagSeverity(cargo: Cargo): 'success' | 'danger' {
    const total = this.totalAbonos(cargo);
    const cargoMonto = this.toNumber(cargo.montoCargo);
    return total === cargoMonto ? 'success' : 'danger';
  }
}
