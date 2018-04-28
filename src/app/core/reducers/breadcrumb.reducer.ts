import {
  BreadcrumbActions,
  BREADCRUMB_UPDATE,
  BREADCRUMB_CLEAR,
  BREADCRUMB_CANCEL,
} from './../actions/breadcrumb.action';
import { BreadcrumbState } from './../store';

const initialState: BreadcrumbState[] = [];

export function breadcrumbReducer(
  state = initialState,
  action: BreadcrumbActions,
): BreadcrumbState[] {
  switch (action.type) {
    case BREADCRUMB_UPDATE:
      const copy = state.map(s => {
        s.active = false;
        return s;
      });
      action.payload.forEach(r => {
        const sameUrl = copy.find(s => s.routeUrl === r.routeUrl);
        if (!sameUrl) {
          copy.push(r);
        } else {
          sameUrl.active = r.active;
        }
      });
      return copy;
    case BREADCRUMB_CLEAR:
      return initialState;
    case BREADCRUMB_CANCEL:
      const filter = state.filter(c => c.routeUrl !== action.payload.routeUrl);
      return filter;
    default:
      return state;
  }
}
