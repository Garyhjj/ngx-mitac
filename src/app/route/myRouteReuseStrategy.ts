import {
  RouteReuseStrategy,
  DefaultUrlSerializer,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
  PRIMARY_OUTLET,
} from '@angular/router';

export class MyRouteReuseStrategy implements RouteReuseStrategy {
  _cacheRouters: { [key: string]: any } = {};
  removeUrlBuffer;
  _cached = [];
  shouldDetach(route: ActivatedRouteSnapshot) {
    if (this.hasInValidRoute(route)) {
      return false;
    }
    return this.can(route);
  }
  store(route: ActivatedRouteSnapshot, handle: any): void {
    let /** @type {?} */ url = this.getUrl(route);
    let /** @type {?} */ idx = this.index(url);
    let /** @type {?} */ item = {
      url: url,
      _snapshot: route,
      _handle: handle,
    };
    if (idx === -1) {
      this._cached.push(item);
    } else {
      this._cached[idx] = item;
    }
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
  get(url) {
    return url
      ? this._cached.find(function(w) {
          return w.url === url;
        }) || null
      : null;
  }
  index(url) {
    return this._cached.findIndex(function(w) {
      return w.url === url;
    });
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
    let /** @type {?} */ url =
      '/' +
      segments
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
