import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {
  VinculoCategoriaUsuarioResponse
} from '../../../../../../apis/model/module/private/operativo/administrativo/response/vinculo-categoria-usuario-response';
import {PickListModule} from 'primeng/picklist';
import {
  UsuarioResponse
} from '../../../../../../apis/model/module/private/admnistrativo/usuario/response/usuario-response';
import {
  CategoriaUsuarioRequest
} from '../../../../../../apis/model/module/private/operativo/administrativo/request/categoria-usuario-request';
import {MessageService} from 'primeng/api';
import {AdministrativoService} from '../../../../../../service/modules/private/operativo/administrativo/administrativo.service';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'app-vincular-usuario-categoria',
  imports: [
    Button,
    Dialog,
    ReactiveFormsModule,
    PickListModule
  ],
  templateUrl: './vincular-usuario-categoria.html',
  styleUrl: './vincular-usuario-categoria.scss',
})
export class VincularUsuarioCategoria {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  protected idEmpresa!: string;
  sourceUsers: UsuarioResponse[] = [];
  targetUsers: UsuarioResponse[] = [];
  protected idCategoria!: number;

  @Input() set UsuariosData(data: VinculoCategoriaUsuarioResponse | undefined) {
    if (!data) return;

    this.sourceUsers = data.usuariosDisponibles ?? [];
    this.targetUsers = data.usuariosVinculados ?? [];
  }

  @Input() set Categoria(idCategoria: number | undefined) {
    if (!idCategoria) return;
    console.log(idCategoria)
    this.idCategoria = idCategoria;
  }

  constructor(private readonly administrativoService: AdministrativoService,
              private readonly messageService: MessageService,) {
    if (sessionStorage.getItem(environment.session.ID_EMPRESA) != undefined) {
      this.idEmpresa = sessionStorage.getItem(environment.session.ID_EMPRESA)!;
    }
  }

  get headerTitle(): string {
    return 'Vincular usuarios';
  }

  protected cerrar() {
    this.visibleChange.emit(false);
  }

  protected onMoveRight(event: any) {
    this.vincular(event.items);
  }

  protected onMoveLeft(event: any) {
    this.desvincular(event.items);
  }

  protected vincular(items: UsuarioResponse[]) {
    const usernames = items.map(u => u.username);

    const request: CategoriaUsuarioRequest = {
      idCategoria: this.idCategoria,
      codigoCliente: Number(this.idEmpresa),
      usernames: usernames
    };

    this.administrativoService.vincularCategoriaUsuario(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmación',
          detail: 'Se vinculó correctamente ',
        });

        this.cerrar();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al vincular'
        });

        this.cerrar();
      }
    });
  }

  protected desvincular(items: UsuarioResponse[]) {
    const usernames = items.map(u => u.username);

    const request: CategoriaUsuarioRequest = {
      idCategoria: this.idCategoria,
      codigoCliente: Number(this.idEmpresa),
      usernames: usernames
    };

    this.administrativoService.desvincularCategoriaUsuario(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmación',
          detail: 'Se desvinculó correctamente ',
        });
        this.cerrar();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al desvincular'
        });
        this.cerrar();
      }
    });
  }
}
