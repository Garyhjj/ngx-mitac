import { Pipe, PipeTransform } from '@angular/core';
import { DataDriveService } from '../../core/services/data-drive.service';
import { isArray } from '../../../../utils/index';
import * as moment from 'moment';
@Pipe({
  name: 'myFlex'
})
export class MyFlexPipe implements PipeTransform {

  constructor(
    private dataDriveService: DataDriveService
  ) { }

  cachedData: { url: string, data: any }[];
  outData;
  transform(value: any, args?: { name: string, params: any[] }): any {
    if (args && this[args.name]) {
      args.params = args.params || [];
      this.outData = value;
      this[args.name](value, ...args.params)
      return this.outData;
    } else {
      return value;
    }
  }

  replace(target: string, o: any) {
    if (target && typeof o === 'object') {
      for (let prop in o) {
        target = target.replace(prop, o[prop]);
      }
    }
    this.outData = target;
  }
  lazyLoad(target: string, api: string) {
    if (api) {
      const bind = (obList) => {
        const ob = obList.find(c => c.property == target)
        if (!ob) return this.outData = target;
        this.outData = ob.value;
      }
      const cache = this.cachedData && this.cachedData.find(c => c.url === api);
      if (cache) {
        bind(cache.data);
      }else {
        this.dataDriveService.lazyLoad(api).subscribe((r: any[]) => {
          if (isArray(r)) {
            const obList = r.filter(f => f).map(d => {
              if (isArray(d)) {
                if (d.length === 1) {
                  return { property: d[0], value: d[0] }
                } else if (d.length > 1) {
                  return { property: d[0], value: d[1] }
                }
              } else if (typeof d === 'object') {
                const keys = Object.keys(d);
                if (keys.length > 1) {
                  return { property: d[keys[0]], value: d[keys[1]] }
                }
              }
            });
            this.cachedData = this.cachedData || [];
            this.cachedData.push({ url: api, data: obList });
            bind(obList);
          } else {
            this.outData = target;
          }
        })
      }
    } else {
      this.outData = target;
    }
  }

  date(target: string, format: string, yourFromat?: string) {
    const toDateA = moment(target, yourFromat);
    if (!toDateA.isValid()) return;
    this.outData = toDateA.format(format);
  }

}