import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';

interface Tracking {
  fecha: string;
  usuarioReg: string;
  evento: string;
}

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
  protected trackList: Tracking[] = [];

  ngOnInit(): void {
    this.trackList = [
      { fecha: '2024-12-01 10:30', usuarioReg: 'jrodriguez', evento: 'Ejecución' },
      { fecha: '2024-12-02 14:15', usuarioReg: 'mlopez', evento: 'Autorización' },
      { fecha: '2024-12-03 09:05', usuarioReg: 'acarvajal', evento: 'Anulación' },
    ];
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }
}
