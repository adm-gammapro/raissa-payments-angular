import {SortOrderEnum} from '../../apis/model/emuns/sort-order.enum';

export class Util {
  public static mapSortOrder(primeNgOrder: number | null | undefined): SortOrderEnum | undefined {
    if (primeNgOrder === 1 || primeNgOrder === null) return SortOrderEnum.ASC;
    if (primeNgOrder === -1) return SortOrderEnum.DESC;
    return undefined;
  }

  public static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
