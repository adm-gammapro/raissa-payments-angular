import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneda',
  standalone: true
})
export class MonedaPipe implements PipeTransform {

  private readonly monedas: Record<string, string> = {
    // América
    'PEN': 'Soles',
    'USD': 'Dólares',
    'CAD': 'Dólares canadienses',
    'MXN': 'Pesos mexicanos',
    'ARS': 'Pesos argentinos',
    'CLP': 'Pesos chilenos',
    'COP': 'Pesos colombianos',
    'BOB': 'Bolivianos',
    'PYG': 'Guaraníes',
    'UYU': 'Pesos uruguayos',
    'BRL': 'Reales',
    'VES': 'Bolívares',

    // Europa
    'EUR': 'Euros',
    'GBP': 'Libras esterlinas',
    'CHF': 'Francos suizos',
    'SEK': 'Coronas suecas',
    'NOK': 'Coronas noruegas',
    'DKK': 'Coronas danesas',
    'PLN': 'Zlotys polacos',
    'RUB': 'Rublos rusos',
    'TRY': 'Liras turcas',

    // Asia
    'JPY': 'Yenes',
    'CNY': 'Yuanes',
    'KRW': 'Wones surcoreanos',
    'INR': 'Rupias indias',
    'SGD': 'Dólares singapurenses',
    'HKD': 'Dólares hongkoneses',
    'TWD': 'Dólares taiwaneses',
    'THB': 'Bahts tailandeses',
    'MYR': 'Ringgits malayos',
    'IDR': 'Rupias indonesias',
    'PHP': 'Pesos filipinos',
    'VND': 'Dongs vietnamitas',
    'AED': 'Dírhams emiratíes',
    'SAR': 'Riyales saudíes',

    // Oceanía
    'AUD': 'Dólares australianos',
    'NZD': 'Dólares neozelandeses',

    // África
    'ZAR': 'Rands sudafricanos',
    'NGN': 'Nairas nigerianas',
    'KES': 'Chelines kenianos',
    'EGP': 'Libras egipcias',
    'MAD': 'Dírhams marroquíes',

    // Otros
    'BTC': 'Bitcoins',
    'ETH': 'Ethereums',
    'USDT': 'Tether',
  };

  transform(value: string | null | undefined, plural: boolean = true): string {
    if (!value) {
      return '';
    }

    const codigo = value.toUpperCase().trim();
    const nombre = this.monedas[codigo];

    if (nombre) {
      return nombre;
    }

    // Si no encuentra la moneda, devuelve el código original
    return codigo;
  }

  /**
   * Obtener el símbolo de la moneda
   */
  getSimbolo(codigo: string): string {
    const simbolos: Record<string, string> = {
      'PEN': 'S/',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥',
      'MXN': '$',
      'ARS': '$',
      'BRL': 'R$',
      'CHF': 'CHF',
    };

    return simbolos[codigo.toUpperCase()] || codigo;
  }
}

/**
 <!-- Uso básico -->
 <span>{{ 'PEN' | moneda }}</span>   <!-- Soles -->
 <span>{{ 'USD' | moneda }}</span>   <!-- Dólares -->
 <span>{{ 'EUR' | moneda }}</span>   <!-- Euros -->

 <!-- En tu tabla -->
 <td>{{ cargo.moneda | moneda }}</td>

 <!-- En tags -->
 <p-tag [value]="cargo.moneda | moneda" severity="info"></p-tag>
 **/
