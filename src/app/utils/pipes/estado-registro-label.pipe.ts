import { Pipe, PipeTransform } from '@angular/core';
import {EstadoRegistroEnum, EstadoRegistroLabels} from '../../apis/model/emuns/estado-registro.enum';

@Pipe({
  name: 'estadoRegistroLabel',
  standalone: true
})
export class EstadoRegistroLabelPipe implements PipeTransform {
  transform(value: keyof typeof EstadoRegistroEnum): string {
    const enumValue = EstadoRegistroEnum[value];
    return EstadoRegistroLabels[enumValue] || value;
  }
}
