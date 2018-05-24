import {
  BreadcrumbActions,
  BREADCRUMB_UPDATE,
  BREADCRUMB_CLEAR,
  BREADCRUMB_CANCEL,
  BREADCRUMB_UNSHIFT,
  BREADCRUMB_REUSE_UPDATE,
} from './../actions/breadcrumb.action';
import { BreadcrumbState } from './../store';

const initialState: BreadcrumbState[] = [];
const isSameUrl = (a: string, b: string) => {
  const format = (tar: string) => (tar[0] === '/' ? tar.slice(1) : tar);
  return format(a) === format(b);
};
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
        const sameUrl = copy.find(s => isSameUrl(s.routeUrl, r.routeUrl));
        if (!sameUrl) {
          copy.push(r);
        } else {
          sameUrl.active = r.active;
        }
      });
      return copy;
    case BREADCRUMB_CLEAR:
      return [];
    case BREADCRUMB_CANCEL:
      const filter = state.filter(
        c => !isSameUrl(c.routeUrl, action.payload.routeUrl),
      );
      return filter;
    case BREADCRUMB_UNSHIFT:
      const payload1 = action.payload;
      const tar = state.find(_ => isSameUrl(_.routeUrl, payload1.routeUrl));
      if (!tar) {
        state.unshift(payload1);
      }
      return state;
    case BREADCRUMB_REUSE_UPDATE:
      const payload = action.payload;
      return state.map(c => {
        if (isSameUrl(c.routeUrl, payload.routeUrl)) {
          return Object.assign(c, payload);
        }
        return c;
      });
    default:
      return state;
  }
}
