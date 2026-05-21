import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule} from 'primeng/message';
import {Cargo} from '../../../../../../apis/model/module/private/operativo/cargar-solicitud/cargo';
import {MessageService} from 'primeng/api';
import {
  CargarSolicitudService
} from '../../../../../../service/modules/private/operativo/cargar-solicitud/cargar-solicitud.service';
import {environment} from '../../../../../../../environments/environment';
import {FileUpload} from 'primeng/fileupload';
import {Tooltip} from 'primeng/tooltip';
import {Badge} from 'primeng/badge';
import {DetalleAbono} from '../../../../../../apis/model/module/private/operativo/cargar-solicitud/detalle-abono';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-vista-previa-solicitud',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    Dialog,
    InputTextModule,
    MessageModule,
    TableModule,
    TagModule,
    FileUpload,
    Tooltip,
    Badge
  ],
  templateUrl: './vista-previa-solicitud.html',
  styleUrl: './vista-previa-solicitud.scss',
})
export class VistaPreviaSolicitud implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() refresh = new EventEmitter<void>();

  protected cargos: Cargo[] = [];
  protected selectedFile?: File;
  protected idEmpresa: string = "";
  protected username: string = "";
  expandedRows: Record<string, boolean> = {};

  constructor(private readonly messageService: MessageService,
              private readonly cargarSolicitudService: CargarSolicitudService) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }
    if (sessionStorage.getItem(environment.session.USERNAME) != undefined) {
      this.username = sessionStorage.getItem(environment.session.USERNAME)!;
    }
  }

  ngOnChanges() {
    // Cada vez que cambien los cargos, reinicia las filas expandidas
    this.expandedRows = {};
  }

  protected cerrar() {
    this.limpiarCarga()
    this.visibleChange.emit(false);
  }

  protected limpiarCarga() {
    this.cargos = [];
    this.selectedFile = undefined;
    this.expandedRows = {};
  }

  protected expandAll() {
    this.expandedRows = this.cargos.reduce((acc, c) => ({...acc, [c.id]: true}), {});
  }

  protected collapseAll() {
    this.expandedRows = {};
  }

  protected monedaSeverity(moneda: 'PEN' | 'USD') {
    return moneda === 'PEN' ? 'info' : 'success';
  }

  protected toNumber(monto: string | number) {
    return Number(String(monto).replace(/,/g, '')) || 0;
  }

  protected totalAbonos(cargo: Cargo) {
    return cargo.detalle.reduce((s, d) => s + (Number(d.montoAbono) || 0), 0);
  }

  protected formatMonto(monto: number, moneda: 'PEN' | 'USD') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'PEN',
      minimumFractionDigits: 2
    }).format(monto || 0);
  }

  protected tagSeverity(cargo: Cargo): 'success' | 'danger' {
    const total = this.totalAbonos(cargo);
    const cargoMonto = this.toNumber(cargo.montoCargo);
    return total === cargoMonto ? 'success' : 'danger';
  }

  onSelect(event: any) {
    this.selectedFile = event.files?.[0];
    if (this.selectedFile) {
      this.leerExcel(this.selectedFile);
    }
  }

  leerExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json<any>(worksheet, {defval: ''});
      this.cargos = this.transformar(rows);
    };
    reader.readAsArrayBuffer(file);
  }

  // ✅ Transformación de filas Excel a Cargos
  transformar(rows: any[]): Cargo[] {
    const cargos: Cargo[] = [];
    let currentCargo: Cargo | null = null;
    let id = 1;

    for (const r of rows) {
      const tipo = (r['Tipo'] || '').toString().trim().toUpperCase();
      const cuenta = (r['Cuenta'] || '').toString().trim();
      const entidad = (r['Codigo entidad financiera'] || '').toString().trim();
      const moneda = (r['moneda'] || '').toString().trim();
      const monto = Number(r['monto'] || 0);
      const tipoDocCliente = (r['Tipo doc Beneficiario'] || '').toString().trim();
      const nroDocCliente = (r['Nro doc Beneficiario'] || '').toString().trim();
      const cliente = (r['Beneficiario'] || '').toString().trim();
      const mismoTitular = (r['Mismo titular'] || '').toString().trim();

      if (tipo === 'H') {
        currentCargo = new Cargo();
        currentCargo.id = id++;
        currentCargo.cuentaCargo = cuenta;
        currentCargo.entidadFinancieraCargo = entidad;
        currentCargo.monedaCuentaCargo = moneda as string;
        currentCargo.montoCargo = monto;
        currentCargo.estadoEjecucion = '';
        currentCargo.detalle = [];
        cargos.push(currentCargo);
      } else if (tipo === 'D' && currentCargo) {
        const det = new DetalleAbono();
        det.cuentaAbono = cuenta;
        det.entidadFinancieraAbono = entidad;
        det.monedaCuentaAbono = moneda as string;
        det.montoAbono = monto;
        det.tipoDocCliente = tipoDocCliente;
        det.nroDocCliente = nroDocCliente;
        det.cliente = cliente;
        det.mismoTitular = mismoTitular;
        det.estadoEjecucion = '';
        det.detalleEjecucion = '';
        currentCargo.detalle.push(det);
      }
    }
    return cargos;
  }

  choose(event: MouseEvent, callback: () => void) {
    callback();
  }

  uploadEvent(callback: () => void) {
    callback();
  }

  enviar() {
    if (!this.selectedFile) {
      this.messageService.add({severity: 'warn', summary: 'Sin archivo', detail: 'Seleccione un archivo primero'});
      return;
    }
    if (this.hasObservados()) {
      this.messageService.add({severity: 'warn', summary: 'Observado', detail: 'Corrija los montos antes de enviar'});
      return;
    }

    this.cargarSolicitudService.cargarExcel(this.selectedFile, this.username, this.idEmpresa).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Enviado',
          detail: 'Registro guardado correctamente',
          life: 5000
        });
        this.visibleChange.emit(false);
        this.refresh.emit();
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo enviar'});
      }
    });
  }

  hasObservados(): boolean {
    return this.cargos.some(c => this.totalAbonos(c) !== this.toNumber(c.montoCargo));
  }
}
