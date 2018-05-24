import { Store } from '@ngrx/store';

import {
  BreadcrumbUpdate,
  BreadcrumbClear,
  BreadcrumbUnshift,
} from './../actions/breadcrumb.action';
import { BreadcrumbState, MyStore } from './../store';

export class BreadcrumbModel {
  breadcrumb: BreadcrumbState[];
  static clear(store$: Store<MyStore>) {
    store$.dispatch(new BreadcrumbClear());
  }
  constructor(route: any[]) {
    if (route.length > 1) {
      this.breadcrumb = [];
      let b: BreadcrumbState = {
        routeName: route[0],
        routeUrl: route[1],
        active: !!route[2],
      };
      this.breadcrumb.push(b);
    }
  }
  update(store$: Store<MyStore>) {
    setTimeout(
      () => store$.dispatch(new BreadcrumbUpdate(this.breadcrumb)),
      500,
    );
  }
  unshift(store$: Store<MyStore>) {
    store$.dispatch(new BreadcrumbUnshift(this.breadcrumb[0]));
  }
}
