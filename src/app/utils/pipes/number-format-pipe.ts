import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  // Mapa de códigos de moneda a sus símbolos
  private readonly CURRENCY_SYMBOLS: { [key: string]: string } = {
    'USD': '$ ',
    'PEN': 'S/ ',
    'EUR': '€ ',
    'GBP': '£ ',
    'MXN': 'MX$ ',
    'ARS': 'AR$ ',
    'CLP': 'CLP$ ',
    'COP': 'COP$ ',
    'BOB': 'Bs. ',
    'PYG': 'Gs. ',
    'UYU': '$U ',
    'VES': 'Bs.S ',
    'BRL': 'R$ '
  };

  transform(
    value: number | string | null | undefined,
    options?: {
      decimalPlaces?: number;
      currency?: string;  // Código de moneda: 'USD', 'PEN', etc.
      prefix?: string;    // Prefijo personalizado (sobrescribe el de la moneda)
      suffix?: string;
      locale?: string;
    }
  ): string {
    // Si el valor es null, undefined o vacío, retornar vacío
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Configuración por defecto
    const config = {
      decimalPlaces: 2,
      currency: '',
      prefix: '',
      suffix: '',
      locale: 'en-US',
      ...options
    };

    // Determinar el prefijo según la moneda
    let prefix = config.prefix;

    // Si no hay prefijo personalizado pero sí código de moneda
    if (!prefix && config.currency) {
      const currencyCode = config.currency.toUpperCase();
      prefix = this.CURRENCY_SYMBOLS[currencyCode] || `${currencyCode} `;
    }

    // Convertir a número si es string
    let numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

    // Si no es un número válido, retornar el valor original
    if (Number.isNaN(numValue)) {
      return String(value);
    }

    try {
      // Usar Intl.NumberFormat para formateo más robusto
      const formatter = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: config.decimalPlaces,
        maximumFractionDigits: config.decimalPlaces,
        useGrouping: true
      });

      let formattedValue = formatter.format(numValue);

      // Agregar prefijo/sufijo si existen
      if (prefix) {
        formattedValue = `${prefix}${formattedValue}`;
      }
      if (config.suffix) {
        formattedValue = `${formattedValue}${config.suffix}`;
      }

      return formattedValue;
    } catch (error) {
      // Fallback a formateo manual si Intl no funciona
      return this.manualFormat(numValue, config.decimalPlaces, prefix, config.suffix);
    }
  }

  /**
   * Formateo manual de respaldo
   */
  private manualFormat(value: number, decimalPlaces: number, prefix?: string, suffix?: string): string {
    const formattedNumber = value.toFixed(decimalPlaces);
    const [integerPart, decimalPart] = formattedNumber.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    let result = `${formattedInteger}.${decimalPart}`;
    if (prefix) result = prefix + result;
    if (suffix) result = result + suffix;

    return result;
  }
}

/**
 <div class="montos">
  <!-- PEN - Mostrará S/. automáticamente -->
  <p>Monto en Soles: {{ 2500.23 | numberFormat:{ currency: 'PEN' } }}</p>
  <!-- Resultado: S/. 2,500.23 -->

  <!-- USD - Mostrará $ automáticamente -->
  <p>Monto en Dólares: {{ 2500.23 | numberFormat:{ currency: 'USD' } }}</p>
  <!-- Resultado: $ 2,500.23 -->

  <!-- Sin moneda, solo formato -->
  <p>Monto sin moneda: {{ 2500.23 | numberFormat }}</p>
  <!-- Resultado: 2,500.23 -->

  <!-- Moneda con decimales específicos -->
  <p>{{ 1502.2 | numberFormat:{ currency: 'PEN', decimalPlaces: 3 } }}</p>
  <!-- Resultado: S/. 1,502.200 -->

  <!-- Moneda con sufijo adicional -->
  <p>{{ 2500.23 | numberFormat:{ currency: 'USD', suffix: ' incl. IGV' } }}</p>
  <!-- Resultado: $ 2,500.23 incl. IGV -->
</div>
**/
