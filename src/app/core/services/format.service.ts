import { Store } from '@ngrx/store';
import { MyStore, UserState } from './../store';
import { catchError, shareReplay, map } from 'rxjs/operators';
import { of, Observable, isObservable } from 'rxjs';
import { APPConfig } from './../../shared/config/app.config';
import { replaceQuery, isNumber, isArray } from './../../shared/utils/index';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

function ResultToObservable(target: any, key: string, descriptor: any) {
  const originalMethod = descriptor.value;
  const newMethod = function(...args: any[]): any {
    const result: any = originalMethod.apply(this, args);
    if (isObservable(result)) {
      return result;
    } else if (result instanceof Promise) {
      return new Observable<any>(ob => {
        result
          .then(_ => {
            ob.next(_);
            ob.complete();
          })
          .catch(e => ob.error(e));
      });
    } else {
      return of(result);
    }
  };
  descriptor.value = newMethod;
}

@Injectable()
export class FormatService {
  user: UserState;
  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private appService: AppService,
    private store$: Store<MyStore>,
    private util: UtilService,
  ) {
    this._cachedData = this.cache.get(this.name, this.key);
    this.store$
      .select(s => s.userReducer)
      .subscribe(user => (this.user = user));
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

  loadAPI(api: string) {
    if (!api) {
      throw new Error('無API');
    }
    return this.http.get(
      replaceQuery(
        api.indexOf('https:') > -1 || api.indexOf('http:') > -1
          ? api
          : APPConfig.baseUrl + api,
        {},
        this.user,
      ),
    );
  }

  replace(target: string, o: any, type?: number) {
    if (target !== null && target !== void 0) {
      target = target + '';
      if (type) {
        switch (+type) {
          case 1:
            if (!isNumber(target)) {
              return target;
            }
        }
      }
      if (typeof o === 'object') {
        // tslint:disable-next-line:forin
        for (let prop in o) {
          target = target.replace(prop, o[prop]);
        }
      } else if (typeof o === 'string') {
        target = o.replace(/\{self\}/g, target);
      }
    }
    return target;
  }
  @ResultToObservable
  lazyLoad(
    target: string,
    api: string,
    lazyParams?: string[],
    noCache?: boolean,
  ) {
    if (api) {
      const bind = obList => {
        if (!isArray(obList)) {
          return obList;
        }
        const ob = obList.find(
          c => c.property === target || +c.property === +target,
        );
        if (!ob) {
          return target;
        }
        return ob.value;
      };
      let cache;
      if (!noCache) {
        cache = this.cachedData && this.cachedData.find(c => c.url === api);
      }
      if (cache) {
        return bind(cache.data);
      } else {
        const doRequest = () => {
          return this.loadAPI(api).pipe(
            map((r: any[]) => {
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
                        const property = d[keys[0]],
                          value = d[keys[0]];
                        return {
                          property: property
                            ? property
                            : replaceQuery(keys[0], d),
                          value: value ? value : replaceQuery(keys[0], d),
                        };
                      } else if (keys.length > 1) {
                        const property = d[keys[0]],
                          value = d[keys[1]];
                        return {
                          property: property
                            ? property
                            : replaceQuery(keys[0], d),
                          value: value ? value : replaceQuery(keys[1], d),
                        };
                      }
                    }
                  }
                  return {};
                });
                this.cachedData = this.cachedData || [];
                this.cachedData = this.cachedData.concat([
                  { url: api, data: obList },
                ]);
                return obList;
              } else {
                return target;
              }
            }),
            catchError(err => of(target)),
          );
        };
        if (noCache) {
          let tempCache = this.cache.get('noCacheStore', api, false);
          if (!tempCache) {
            tempCache = doRequest().pipe(shareReplay());
            this.cache.update('noCacheStore', api, tempCache, 2 * 1000);
          } else {
            return tempCache.pipe(map(d => bind(d)));
          }
        } else {
          if (!this.lazyLoadRequest[api]) {
            this.lazyLoadRequest[api] = doRequest().toPromise();
          }
          return this.lazyLoadRequest[api].then(d => bind(d));
        }
      }
    } else {
      return target;
    }
  }

  date(target: string, format: string, yourFromat?: string) {
    return this.util.dateFormat(target, format, yourFromat);
  }
  /**
   *
   *
   * @param {string} target
   * @param {string} format NO工号，CH中文名，EN英文名 如 NO-CH-EN
   * @returns
   * @memberof MyFlexPipe
   */
  @ResultToObservable
  empno(target: string, format: string): Observable<string> {
    const cache =
      this.cachedData && this.cachedData.find(c => c.url === this.empCacheKey);
    const tranform = (val: any, _format: string) => {
      if (typeof val !== 'object' || !val) {
        return val;
      }
      if (format === '{AVATAR_URL}') {
        const pic: string = val['AVATAR_URL'];
        return pic && pic.indexOf('default.png') > -1
          ? pic
          : APPConfig.baseUrl + pic;
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
          .pipe(
            map((data: any) => {
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
            }),
            catchError(err => of(target)),
          )
          .toPromise();
      }
      return this.colleagueRequest[target].then(val => {
        return typeof format === 'string' ? tranform(val, format) : val;
      });
    }
  }
  toFixed(target: number, size: number) {
    size = +size;
    if (!isNumber(target)) {
      return target;
    } else {
      return (+target).toFixed(size);
    }
  }
}
