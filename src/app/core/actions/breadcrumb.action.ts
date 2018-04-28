import { Action } from '@ngrx/store';

import { BreadcrumbState } from './../store';

export const BREADCRUMB_UPDATE = '[breadcrumb] update';
export const BREADCRUMB_CLEAR = '[breadcrumb] clear';
export const BREADCRUMB_CANCEL = '[breadcrumb] cancel';
export class BreadcrumbUpdate implements Action {
  readonly type = BREADCRUMB_UPDATE;
  payload: BreadcrumbState[];
  constructor(breadcrumb: BreadcrumbState[]) {
    this.payload = breadcrumb;
  }
}

export class BreadcrumbClear implements Action {
  readonly type = BREADCRUMB_CLEAR;
  payload;
  constructor() {}
}

export class BreadcrumbCancel implements Action {
  readonly type = BREADCRUMB_CANCEL;
  payload: BreadcrumbState;
  constructor(breadcrumb: BreadcrumbState) {
    this.payload = breadcrumb;
  }
}

export type BreadcrumbActions =
  | BreadcrumbUpdate
  | BreadcrumbClear
  | BreadcrumbCancel;
