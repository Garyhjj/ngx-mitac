import { InputSet } from './index';

export interface DataDriveOptions {
    id: number;
    searchSets?: SearchItemSet[];
    tableData: TableData;
    APIs: {
        search: string;
        delete?: string;
        add?: string;
        update?: string;
    };
    dataViewSet?: DataViewSet;
    selfHideLists?: string[];
}

export class DataDrive implements DataDriveOptions {
    id: number;
    searchSets?: SearchItemSet[];
    tableData: TableData;
    APIs: {
        search: string;
        delete?: string;
        add?: string;
        update?: string;
    };
    dataViewSet?: DataViewSet;
    private user: string;
    private _selfHideLists?: string[];
    allHideLists: string[];
    constructor(opts: DataDriveOptions, user: string) {
        Object.assign(this, opts);
        this.user = user;
    }

    get selfStoreName() {
        return 'selfStoreSet';
    }
    set selfHideLists(ls: string[]) {
        this._selfHideLists = ls;
        // localStorage.setItem(this.selfStoreName,)
        this.combineHideLists();
    }
    get selfHideLists() {
        return this._selfHideLists;
    }
    combineHideLists() {
        this.selfHideLists = this.selfHideLists || [];
        const baseHideLists: string[] = this.dataViewSet.hideLists || [];
        this.allHideLists = this.selfHideLists.concat(baseHideLists).filter(function (ele, index, array) {
            return index === array.indexOf(ele);
        });
    }
    private init() {

    }
    private initSearchSets() {
        if (this.searchSets && this.searchSets.length > 0) {
            this.searchSets = this.searchSets.map(s => {
                s.InputOpts = new InputSetFactory(s.InputOpts);
                return s;
            });
        }
    }

    private initDataViewSet() {
        this.dataViewSet = this.dataViewSet || {};
        this.dataViewSet = new DataViewSetFactory(this.dataViewSet);
    }
    private initTableData() {
        this.tableData.columns = this.tableData.columns.map(c => {
            c.type = c.type || {};
            c.type.InputOpts = new InputSetFactory(c.type.InputOpts);
            return c;
        });
    }
}

export type DataViewType = 'table' | 'chart';
export interface DataViewSet {
    type?: DataViewType;
    subType?: string;
    title?: string;
    hideLists?: string[];
    more?: Object;
}
export class TabelViewSet implements DataViewSet {
    type: DataViewType;
    more: {
        addOrder: boolean
    };
    constructor(opts?: DataViewSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.more = this.more || { addOrder: true };
        this.type = 'table';
    }
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
export interface SearchItemSet {
    property: string;
    InputOpts?: InputSet;
}
export interface TableData {
    columns: { property: string, value: string, type: DataType }[];
    data: { property: string, value: string }[];
}

export interface DataType {
    InputOpts?: InputSet;
}

export interface InputSet {
    type?: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    selections?: string[] | number[];
    default?: string | boolean | number;
}


export class InputSetDefault implements InputSet {
    editable: boolean;
    cascadable: boolean;
    default?: string | boolean | number;
    constructor() {
        this.editable = true;
        this.default = '';
    }
}
export class InputSetFactory extends InputSetDefault {
    constructor(opts: InputSet = {}) {
        super();
        Object.assign(this, this.get(opts.type, opts));
    }

    get(type: InputTypes = 'text', opts?: InputSet) {
        switch (type) {
            case 'text':
            default:
                return new TextInputSet(opts);
        }
    }
}

export type InputTypes = 'text' | 'number' | 'date' | 'rate' | 'select';

export class TextInputSet implements InputSet {
    type: InputTypes;
    editable?: boolean;
    placeHolder?: string;
    cascadable?: boolean;
    selections?: string[] | number[];
    default?: string | boolean | number;
    constructor(opts?: InputSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        opts.type = 'select';
    }
}

export class NumberInputSet extends TextInputSet {
    type: InputTypes;
    constructor(opts: InputSet) {
        super(opts);
        this.type = 'number';
        this.default = Number(this.default);
    }
}

export class SelectInputSet implements InputSet {
    type: InputTypes = 'select';
    editable?: boolean;
    placeHolder?: string;
    default?: string | boolean | number;
    constructor(opts?: InputSet) {
        if (opts) {
            this.default = opts.default;
            this.editable = opts.editable;
            this.placeHolder = opts.placeHolder;
        }
    }
}

