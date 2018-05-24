import { BreadcrumbReuseUpdate } from './../core/actions/breadcrumb.action';
import { BreadcrumbModel } from './../core/models/breadcrumb.model';
import { DOCUMENT } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { MyStore, BreadcrumbState } from './../core/store';
import {
  RouteReuseStrategy,
  DefaultUrlSerializer,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
  PRIMARY_OUTLET,
} from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class MyRouteReuseStrategy implements RouteReuseStrategy {
  removeUrlBuffer;
  doc: Document;
  tab: BreadcrumbState[];
  first = true;
  constructor(private store$: Store<MyStore>, @Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.store$.select(s => s.breadcrumbReducer).subscribe(_ => (this.tab = _));
  }
  shouldDetach(route: ActivatedRouteSnapshot) {
    if (this.first) {
      if (this.tab.length < 2) {
        const url = this.getUrl(route);
        const dataRoute = (() => {
          const arr = url.split('/');
          arr.splice(0, 1);
          return '/' + arr.join('/');
        })();
        const tar = this.doc.querySelector(
          `li.ant-menu-item[data-route="${dataRoute}"]`,
        );
        if (tar) {
          new BreadcrumbModel([[tar.textContent.trim()], url]).unshift(
            this.store$,
          );
        }
      }
      this.first = false;
    }
    if (this.hasInValidRoute(route)) {
      return false;
    }
    return this.can(route);
  }
  store(route: ActivatedRouteSnapshot, handle: any): void {
    let /** @type {?} */ url = this.getUrl(route);
    let /** @type {?} */ item = {
      routeUrl: url,
      _snapshot: route,
      _handle: handle,
    };
    this.store$.dispatch(new BreadcrumbReuseUpdate(item));
    this.removeUrlBuffer = null;
    if (handle && handle.componentRef) {
      this.runHook('_onReuseDestroy', url, handle.componentRef);
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (this.hasInValidRoute(route)) {
      return false;
    }
    let /** @type {?} */ url = this.getUrl(route);
    let /** @type {?} */ data = this.get(url);
    let /** @type {?} */ ret = !!(data && data._handle);
    return ret;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (this.hasInValidRoute(route)) {
      return null;
    }
    let /** @type {?} */ url = this.getUrl(route);
    let /** @type {?} */ data = this.get(url);
    let /** @type {?} */ ret = (data && data._handle) || null;
    if (ret && ret.componentRef) {
      this.runHook('_onReuseInit', url, ret.componentRef);
    }
    return ret;
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    let /** @type {?} */ ret = future.routeConfig === curr.routeConfig;
    if (!ret) {
      return false;
    }
    let /** @type {?} */ path =
      /** @type {?} */ ((future.routeConfig && future.routeConfig.path) || '');
    // tslint:disable-next-line:no-bitwise
    if (path.length > 0 && ~path.indexOf(':')) {
      let /** @type {?} */ futureUrl = this.getUrl(future);
      let /** @type {?} */ currUrl = this.getUrl(curr);
      ret = futureUrl === currUrl;
    }
    return ret;
  }

  runHook(method, url, comp) {
    if (comp.instance && typeof comp.instance[method] === 'function') {
      comp.instance[method]();
    }
  }
  isSameUrl(a: string, b: string) {
    const format = (tar: string) => (tar[0] === '/' ? tar.slice(1) : tar);
    return format(a) === format(b);
  }
  get(url) {
    return url
      ? this.tab.find(w => {
          return this.isSameUrl(w.routeUrl, url);
        }) || null
      : null;
  }
  hasInValidRoute(route: ActivatedRouteSnapshot) {
    return (
      !route.routeConfig ||
      route.routeConfig.loadChildren ||
      route.routeConfig.children
    );
  }
  can(route: ActivatedRouteSnapshot) {
    let /** @type {?} */ url = this.getUrl(route);
    if (url === this.removeUrlBuffer) {
      return false;
    }
    if (route.data && typeof route.data['reuse'] === 'boolean') {
      return route.data['reuse'];
    }
    return true;
  }
  getUrl(route: ActivatedRouteSnapshot) {
    let /** @type {?} */ next = this.getTruthRoute(route);
    let /** @type {?} */ segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    let /** @type {?} */ url = segments
      .filter(function(i) {
        return i;
      })
      .reverse()
      .join('/');
    return url;
  }
  getTruthRoute(route: ActivatedRouteSnapshot) {
    let /** @type {?} */ next = route;
    while (next.firstChild) {
      next = next.firstChild;
    }
    return next;
  }
}
