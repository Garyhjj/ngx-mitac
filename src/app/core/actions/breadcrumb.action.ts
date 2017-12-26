import { Action } from '@ngrx/store';

import { BreadcrumbState } from './../store';


export const BREADCRUMB_UPDATE = '[breadcrumb] update';
export const BREADCRUMB_CLEAR = '[breadcrumb] clear';

export class Breadcrumb_Update implements Action {
  readonly type = BREADCRUMB_UPDATE;
  payload: BreadcrumbState[];
  constructor(breadcrumb:BreadcrumbState[]) {
    this.payload = breadcrumb;
  }
}

export class Breadcrumb_Clear implements Action {
  readonly type = BREADCRUMB_CLEAR;
  payload;
  constructor() {
  }
}


export type BreadcrumbActions = Breadcrumb_Update | Breadcrumb_Clear;
