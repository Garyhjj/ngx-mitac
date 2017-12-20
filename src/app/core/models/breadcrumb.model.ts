import { Store } from '@ngrx/store';

import { Breadcrumb_Update } from './../actions/breadcrumb.action';
import { BreadcrumbState, myStore } from './../store';

export class BreadcrumbModel{
    breadcrumb:BreadcrumbState[];
    constructor(route:string[]){
        if(route.length>0) {
            this.breadcrumb = [];
            route.forEach(r => {
                let b: BreadcrumbState={routeName:''};
                b.routeName = r;
                this.breadcrumb.push(b);
            })
        }
    }
    update(store$: Store<myStore>) {
        store$.dispatch(new Breadcrumb_Update(this.breadcrumb));
    }
}