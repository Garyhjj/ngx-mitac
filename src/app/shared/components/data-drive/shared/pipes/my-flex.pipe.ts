import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';
import { DataDriveService } from '../../core/services/data-drive.service';
import { isArray, replaceQuery } from '../../../../utils/index';
import * as moment from 'moment';
import { CacheService } from '../../../../../core/services/cache.service';
import { AppService } from '../../../../../core/services/app.service';
@Pipe({
  name: 'myFlex',
})
export class MyFlexPipe implements PipeTransform {
  constructor(
    private dataDriveService: DataDriveService,
    private cache: CacheService,
    private appService: AppService,
  ) {
    this._cachedData = this.cache.get(this.name, this.key);
  }

  _cachedData: { url: string; data: any }[];

  get cachedData() {
    return this._cachedData;
  }

  set cachedData(c) {
    this.cache.update(this.name, this.key, c);
    this._cachedData = c;
  }

  name = 'myFlexPipe';
  key = 'lazyLoad';

  empCacheKey = 'empCacheKey';
  lazyLoadRequest: any = {};
  colleagueRequest: any = {};
  outData;
  transform(value: any, args?: { name: string; params: any[] }): any {
    if (args && this[args.name]) {
      args.params = args.params || [];
      const res = this[args.name](value, ...args.params);
      return res instanceof Observable || res instanceof Promise
        ? res
        : Observable.of(res);
    } else {
      return Observable.of(value);
    }
  }

  replace(target: string, o: any) {
    if (target && typeof o === 'object') {
      // tslint:disable-next-line:forin
      for (let prop in o) {
        target = target.replace(prop, o[prop]);
      }
    }
    return target;
  }
  lazyLoad(target: string, api: string, lazyParams?: string[]) {
    if (api) {
      const bind = obList => {
        const ob = obList.find(
          c => c.property === target || +c.property === +target,
        );
        if (!ob) {
          return target;
        }
        return ob.value;
      };
      const cache = this.cachedData && this.cachedData.find(c => c.url === api);
      if (cache) {
        return bind(cache.data);
      } else {
        if (!this.lazyLoadRequest[api]) {
          this.lazyLoadRequest[api] = this.dataDriveService
            .lazyLoad(api)
            .map((r: any[]) => {
              if (isArray(r)) {
                const obList = r.filter(f => f).map(d => {
                  if (isArray(d)) {
                    if (d.length === 1) {
                      return { property: d[0], value: d[0] };
                    } else if (d.length > 1) {
                      return { property: d[0], value: d[1] };
                    }
                  } else if (typeof d === 'object') {
                    let keys = Object.keys(d);
                    if (keys.length > 0) {
                      if (isArray(lazyParams) && lazyParams.length > 0) {
                        keys = lazyParams;
                      }
                      if (keys.length === 1) {
                        return { property: d[keys[0]], value: d[keys[0]] };
                      } else if (keys.length > 1) {
                        return { property: d[keys[0]], value: d[keys[1]] };
                      }
                    }
                  }
                  return {};
                });
                this.cachedData = this.cachedData || [];
                this.cachedData = this.cachedData.concat([
                  { url: api, data: obList },
                ]);
                return bind(obList);
              } else {
                return target;
              }
            })
            .catch(err => Observable.of(target))
            .toPromise();
        }
        return this.lazyLoadRequest[api];
      }
    } else {
      return target;
    }
  }

  date(target: string, format: string, yourFromat?: string) {
    const toDateA = moment(target, yourFromat);
    if (!toDateA.isValid()) {
      return;
    }
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
    const cache =
      this.cachedData && this.cachedData.find(c => c.url === this.empCacheKey);
    const tranform = (val: any, _format: string) => {
      if (typeof val !== 'object' || !val) {
        return val;
      }
      const middle = replaceQuery(_format, val);
      const last = middle
        .replace(/NO/g, val.EMPNO)
        .replace(/CH/g, val.NICK_NAME)
        .replace(/EN/g, val.USER_NAME);
      return last;
    };
    if (cache && cache.data && cache.data[target]) {
      const val = cache.data[target];
      return typeof format === 'string' ? tranform(val, format) : val;
    } else {
      if (!this.colleagueRequest[target]) {
        this.colleagueRequest[target] = this.appService
          .getColleague(target)
          .map((data: any) => {
            if (data.length > 0) {
              const val = data.find(
                d =>
                  d.EMPNO === target ||
                  d.NICK_NAME === target ||
                  d.USER_NAME === target,
              );
              if (!val) {
                return target;
              }
              this._cachedData = this._cachedData || [];
              const cacheSub =
                this.cachedData &&
                this.cachedData.find(c => c.url === this.empCacheKey);
              if (cacheSub && cacheSub.data) {
                cacheSub.data[target] = val;
                this.cachedData = this.cachedData;
              } else {
                this.cachedData = this._cachedData.concat([
                  { url: this.empCacheKey, data: { [target]: val } },
                ]);
              }
              return val;
            } else {
              return target;
            }
          })
          .catch(err => Observable.of(target))
          .toPromise();
      }
      return this.colleagueRequest[target].then(val => {
        return typeof format === 'string' ? tranform(val, format) : val;
      });
    }
  }
}
