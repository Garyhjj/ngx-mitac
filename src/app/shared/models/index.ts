import { bindEventForArray } from "../util/index";

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
    tableData: TableDataModel;
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
    private dataViewSetFactory;
    private inputSetFactory;
    private selfStoreSet;
    private selfStore;
    constructor(
        opts: DataDriveOptions,
        user: string = 'default',
        dataViewSetFactory: DataViewSetFactory = DataViewSetFactory,
        inputSetFactory = DataViewSetFactory,
        selfStoreSet = SelfStoreSet,
        selfStore = SelfStore) {
        Object.assign(this, opts);
        this.user = user;
        this.dataViewSetFactory = dataViewSetFactory;
        this.inputSetFactory = inputSetFactory;
        this.selfStoreSet = new selfStoreSet();
        this.selfStore = selfStore;
        this.init();
    }

    set selfHideLists(ls: string[]) {
        this._selfHideLists = ls;
        bindEventForArray(this._selfHideLists, this.updateSelfStoreSet.bind(this));
        this.updateSelfStoreSet();
    }
    private updateSelfStoreSet() {
        const storeSet = new this.selfStore(this.user, [{ id: this.id, prefer: this._selfHideLists }]);
        this.selfStoreSet.update(storeSet);
        this.combineHideLists();
    }
    get selfHideLists() {
        return this._selfHideLists;
    }
    private combineHideLists() {
        this._selfHideLists = this._selfHideLists || [];
        const baseHideLists: string[] = this.dataViewSet.hideLists || [];
        this.allHideLists = this.selfHideLists.concat(baseHideLists).filter(function (ele, index, array) {
            return index === array.indexOf(ele);
        });
    }
    private init() {
        this.initDataViewSet();
        this.initSearchSets();
        this.initTableData();
    }
    private initSearchSets() {
        if (this.searchSets && this.searchSets.length > 0) {
            this.searchSets = this.searchSets.map(s => {
                s.InputOpts = new this.inputSetFactory(s.InputOpts);
                return s;
            });
        }
    }

    private initDataViewSet() {
        this.dataViewSet = new this.dataViewSetFactory(this.dataViewSet);
    }
    private initTableData() {
        this.tableData.columns = this.tableData.columns.map(c => {
            c.type = c.type || {};
            c.type.InputOpts = new this.inputSetFactory(c.type.InputOpts);
            return c;
        });
    }
}

export class SelfStore {
    user: string; set: { id: string | number, prefer: any }[];
    constructor(user: string, set: { id: string | number, prefer: any }[]) {
        this.user = user;
        this.set = set;
    }
    combine(other: SelfStore) {
        if (other && other.user === this.user) {
            other.set = other.set || [];
            this.set.forEach(s => {
                const idx = other.set.findIndex(o => o.id === s.id);
                if (idx > -1) {
                    other.set.splice(idx, 1, s);
                } else {
                    other.set.push(s);
                }
                other.set = other.set.map(o => {
                    if (o.id === s.id) {
                        o.prefer = s.prefer;
                    }
                    return o;
                });
            });
        } else {
            return other;
        }
    }
}
export class SelfStoreSet {
    store: SelfStore[];
    private _maxUser: number;
    constructor() {
        this.store = this.getStore();
        this._maxUser = 3;
    }

    get selfStoreName() {
        return 'selfStoreSet';
    }
    get maxUser() {
        return this._maxUser;
    }
    set maxUser(val: number) {
        this._maxUser = val;
    }

    getStore() {
        const storeStr = localStorage.getItem(this.selfStoreName);
        let store;
        if (storeStr) {
            store = JSON.parse(storeStr);
            return store instanceof Array ? store : [];
        }
        return [];
    }
    update(set: SelfStore) {
        let store = this.getStore();
        const targetIdx = store.findIndex(s => s && s.user === set.user);
        if (targetIdx < 0) {
            while (store.length > 2) {
                store.shift();
            }
            store.push(set);
        } else {
            store = store.map((s: SelfStore, i) => {
                return set.combine(s);
            });
        }
        this.store = store;
        localStorage.setItem(this.selfStoreName, JSON.stringify(store));
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

export interface TabelViewSetMore {
    title?: {
        enable: boolean;
    };
    border_y?: {
        enable: boolean;
    };
    header?: {
        textColor?: string;
        textSize?: string;
        bgColor?: string
    };
    body?: {
        textColor?: string;
        textSize?: string;
        bgColor?: string;
        rule?: {
            match: string[][];
            textColor?: string;
            textSize?: string;
            bgColor?: string;
        }
    };
    addOrder?: boolean;
    fixedHeader?: {
        enable: boolean;
        scrollHeight?: number | 'auto';
        width?: string[];
        autoScroll?: {
            interval: number;
            loop?: boolean
        }
    };
    pageSet?: {
        enable: boolean;
        count?: number;
    };
    size?: 'default' | 'middle' | 'small';
    footer?: {
        enable: boolean;
        content: string;
    };
}
export class TabelViewSet implements DataViewSet {
    type: DataViewType;
    title?: string;
    more: TabelViewSetMore;

    constructor(opts?: DataViewSet) {
        if (opts) {
            Object.assign(this, opts);
        }
        this.title = 'test';
        this.more = this.more || {
            title: { enable: true },
            pageSet: { enable: false, count: 10 },
            size: 'default', border_y: { enable: false },
            header: {
                textColor: '#fff',
                bgColor: '#000'
            },
            body: {
                textColor: 'red',
                bgColor: '#000',
                rule: {
                    match: [['1', '^\s*$']],
                    textColor: 'green',
                }
            },
            fixedHeader: {
                enable: true,
                scrollHeight: 'auto',
                autoScroll: {
                    interval: 1000,
                    loop: true
                }
            },
            footer: { enable: false, content: '' }
        };
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
    editable?: boolean;
    addable?: boolean;
    deletable?: boolean;
    visible?: boolean;
    columns: { property: string, value: string, type: DataType }[];
    data?: { property: string, value: string }[][];
}

export class TableDataModel implements TableData {
    editable: boolean;
    addable: boolean;
    deletable: boolean;
    visible: boolean;
    columns: { property: string, value: string, type: DataType }[];
    data?: { property: string, value: string }[][];
    constructor(opts: TableData) {
        this.editable = false;
        this.deletable = false;
        this.addable = false;
        this.visible = true;
        Object.assign(this, opts);
    }
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

