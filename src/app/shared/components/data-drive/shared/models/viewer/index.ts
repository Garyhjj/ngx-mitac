import { TabelViewSet } from './table';
export type DataViewType = 'table' | 'chart';
export * from './table';
export interface DataViewSet {
    type?: DataViewType;
    subType?: string;
    title?: string;
    hideLists?: string[];
    more?: any;
    changeHeaderFontSize?: Function;
    changeBodyFontSize?: Function;
}

export class DataViewSetFactory {
    constructor(opts: DataViewSet = { type: 'table' }) {
        switch (opts.type) {
            case 'table':
            default:
                return new TabelViewSet(opts);
        }
    }
}