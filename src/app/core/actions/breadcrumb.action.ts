import { Action } from '@ngrx/store';

import { BreadcrumbState } from './../store';


export const BREADCRUMB_UPDATE = '[breadcrumb] update';


export class Breadcrumb_Update implements Action {
  readonly type = BREADCRUMB_UPDATE;
  payload: BreadcrumbState[];
  constructor(breadcrumb:BreadcrumbState[]) {
    this.payload = breadcrumb;
  }
}


export type BreadcrumbActions = Breadcrumb_Update ;
