import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';
import { DataDriveService } from '../../core/services/data-drive.service';
import { isArray } from '../../../../utils/index';
import * as moment from 'moment';
import { CacheService } from '../../../../../core/services/cache.service';
import { AppService } from '../../../../../core/services/app.service';
@Pipe({
  name: 'myFlex'
})
export class MyFlexPipe implements PipeTransform {

  constructor(
    private dataDriveService: DataDriveService,
    private cache: CacheService,
    private appService: AppService
  ) {
    this._cachedData = this.cache.get(this.name, this.key);
  }

  _cachedData: { url: string, data: any }[];

  get cachedData() {
    return this._cachedData;
  }

  set cachedData(c) {
    this.cache.update(this.name, this.key, c);
    this._cachedData = c;
  }

  name = 'myFlexPipe';
  key = 'lazyLoad'

  empCacheKey = 'empCacheKey'

  outData;
  transform(value: any, args?: { name: string, params: any[] }): any {
    if (args && this[args.name]) {
      args.params = args.params || [];
      const res = this[args.name](value, ...args.params);
      return res instanceof Observable ? res : Observable.of(res);
    } else {
      return Observable.of(value);
    }
  }

  replace(target: string, o: any) {
    if (target && typeof o === 'object') {
      for (let prop in o) {
        target = target.replace(prop, o[prop]);
      }
    }
    return target;
  }
  lazyLoad(target: string, api: string, lazyParams?: string[]) {
    if (api) {
      const bind = (obList) => {
        const ob = obList.find(c => c.property == target)
        if (!ob) return target;
        return ob.value;
      }
      const cache = this.cachedData && this.cachedData.find(c => c.url === api);
      if (cache) {
        return bind(cache.data);
      } else {
        return this.dataDriveService.lazyLoad(api).map((r: any[]) => {
          if (isArray(r)) {
            const obList = r.filter(f => f).map(d => {
              if (isArray(d)) {
                if (d.length === 1) {
                  return { property: d[0], value: d[0] }
                } else if (d.length > 1) {
                  return { property: d[0], value: d[1] }
                }
              } else if (typeof d === 'object') {
                let keys = Object.keys(d);
                if (keys.length > 0) {
                  if (isArray(lazyParams) && lazyParams.length > 0) {
                    keys = lazyParams;
                  }
                  if(keys.length === 1) {
                    return { property: d[keys[0]], value: d[keys[0]] }
                  }else if(keys.length > 1) {
                    return { property: d[keys[0]], value: d[keys[1]] }
                  }
                }
              }
              return {};
            });
            this.cachedData = this.cachedData || [];
            this.cachedData = this.cachedData.concat([{ url: api, data: obList }]);
            return bind(obList);
          } else {
            return target;
          }
        }).catch((err => Observable.of(target)));
      }
    } else {
      return target;
    }
  }

  date(target: string, format: string, yourFromat?: string) {
    const toDateA = moment(target, yourFromat);
    if (!toDateA.isValid()) return;
    return toDateA.format(format);
  }
  /**
   * 
   * 
   * @param {string} target 
   * @param {string} format NO工号，CH中文名，EN英文名 如 NO-CH-EN
   * @returns 
   * @memberof MyFlexPipe
   */
  empno(target: string, format?: string) {
    const cache = this.cachedData && this.cachedData.find(c => c.url === this.empCacheKey);
    const tranform = (val:string, format:string) => {
      const mesList = val.split(',');
      const lg = mesList.length;
      const last = lg > 2? format.replace(/NO/g,mesList[0]).replace(/CH/g,mesList[1]).replace(/EN/g,mesList[2]): format.replace(/NO/g,mesList[0]).replace(/EN/g,mesList[1]).replace(/CH/g, '');
      return last;
    } 
    if (cache && cache.data && cache.data[target]) {
      const val = cache.data[target];
      return typeof format === 'string' ? tranform(val, format): val;
    } else {
      return this.appService.getColleague(target).map((data: any) => {
        if (data.length === 1) {
          const val = data[0];
          this._cachedData = this._cachedData || [];
          const cache = this.cachedData && this.cachedData.find(c => c.url === this.empCacheKey);
          if (cache && cache.data) {
            cache.data[target] = val;
            this.cachedData = this.cachedData;
          } else {
            this.cachedData = this._cachedData.concat([{ url: this.empCacheKey, data: { [target]: val } }]);
          }
          return typeof format === 'string' ? tranform(val, format): val;
        } else {
          return target;
        }
      }).catch((err => Observable.of(target)));
    }
  }

}