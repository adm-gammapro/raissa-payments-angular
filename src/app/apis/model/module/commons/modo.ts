export class Modo {
  valor: string;
  descripcion: string;

  constructor(valor: string, descripcion: string) {
    this.valor = valor;
    this.descripcion = descripcion;
  }

  static modos: Modo[] = [
    new Modo('I', 'Individual'),
    new Modo('M', 'Mancomunado'),
  ];
}
