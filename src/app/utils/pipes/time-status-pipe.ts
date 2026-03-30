import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeStatus'
})
export class TimeStatusPipe implements PipeTransform {
  transform(fechaCarga: string | undefined, thresholdMinutes: number = 30): boolean {
    if (!fechaCarga) return false;

    // Parsear "dd/mm/yyyy HH:mm:ss"
    const [datePart, timePart] = fechaCarga.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    // el mes en JS Date empieza en 0 (enero = 0)
    const fechaCargaDate = new Date(year, month - 1, day, hours, minutes, seconds);
    const now = new Date();

    const diffMs = now.getTime() - fechaCargaDate.getTime();
    const diffMin = diffMs / (1000 * 60);

    // Retorna true si han pasado menos o igual a los minutos del umbral
    return diffMin <= thresholdMinutes;
  }
}
