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
} from '../../../../../../service/modules/private/operativo/cargar-solicitud/cargar-solicitud';
import {environment} from '../../../../../../../environments/environment';

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
    TagModule
  ],
  templateUrl: './vista-previa-solicitud.html',
  styleUrl: './vista-previa-solicitud.scss',
})
export class VistaPreviaSolicitud implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() refresh = new EventEmitter<void>();
  @Input() mostrar = false;
  @Input() cargos: Cargo[] = [];
  @Input() selectedFile?: File;
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
    this.visibleChange.emit(false);
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
