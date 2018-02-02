import { ExamViewSet } from './exam';
import { TabelViewSet } from './table';
export type DataViewType = 'table' | 'chart' | 'exam';
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
            case 'exam':
                return new ExamViewSet(opts);
            case 'table':
            default:
                return new TabelViewSet(opts);
        }
    }
}
