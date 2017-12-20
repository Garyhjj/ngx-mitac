import { BreadcrumbActions, BREADCRUMB_UPDATE } from './../actions/breadcrumb.action';
import { BreadcrumbState } from './../store';

const initialState: BreadcrumbState[] = [{routeName:'Home'}];

export const breadcrumbReducer =function(state = initialState, action: BreadcrumbActions): BreadcrumbState[] {
    switch (action.type) {
        case BREADCRUMB_UPDATE:
            return initialState.concat(action.payload);
        default:
            return state;
    }
}