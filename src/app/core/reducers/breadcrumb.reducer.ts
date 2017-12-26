import { BreadcrumbActions, BREADCRUMB_UPDATE, BREADCRUMB_CLEAR } from './../actions/breadcrumb.action';
import { BreadcrumbState } from './../store';

const initialState: BreadcrumbState[] = [{ routeName: 'Home' }];

export const breadcrumbReducer = function (state = initialState, action: BreadcrumbActions): BreadcrumbState[] {
    switch (action.type) {
        case BREADCRUMB_UPDATE:
            return initialState.concat(action.payload);
        case BREADCRUMB_CLEAR:
            return initialState
        default:
            return state;
    }
}