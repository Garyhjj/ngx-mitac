import { Store } from '@ngrx/store';

import { Breadcrumb_Update, Breadcrumb_Clear } from './../actions/breadcrumb.action';
import { BreadcrumbState, myStore } from './../store';

export class BreadcrumbModel{
    breadcrumb:BreadcrumbState[];
    constructor(route:any[]){
        if(route.length>1) {
            this.breadcrumb = [];
            let b: BreadcrumbState={routeName:route[0], routeUrl: route[1], active: !!route[2]};
            this.breadcrumb.push(b);
        }
    }
    update(store$: Store<myStore>) {
        store$.dispatch(new Breadcrumb_Update(this.breadcrumb));
    }

    static clear(store$: Store<myStore>) {
        store$.dispatch(new Breadcrumb_Clear());
    }
}