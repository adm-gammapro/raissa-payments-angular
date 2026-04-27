export class Predeterminado {
  valor: string;
  descripcion: string;

  constructor(valor: string, descripcion: string) {
    this.valor = valor;
    this.descripcion = descripcion;
  }

  static predeterminados: Predeterminado[] = [
    new Predeterminado('S', 'Si'),
    new Predeterminado('N', 'No'),
  ];
}
