export interface TableDataColumn {
    property: string;
    value: string;
    more?: {
        type?: {
            name: string,
            params?: any;
        },
        pipe?: {
            name: string,
            params: any[]
        },
        sortBy?: {
            name: string,
            params: any[]
        }
    };
}
export interface TableInsideData {
    property: string;
    value: string;
    hide?: boolean;
}
export interface TableData {
    editable?: boolean;
    addable?: boolean;
    deletable?: boolean;
    visible?: boolean;
    searchable?: boolean;
    stopFirstInit?: boolean;
    isCompanyLimited?: boolean | string;
    defaultSearchParams?: any;
    columns: TableDataColumn[];
    data?: TableInsideData[][];
}

export class TableDataModel implements TableData {
    editable: boolean;
    addable: boolean;
    deletable: boolean;
    visible: boolean;
    stopFirstInit?: boolean;
    isCompanyLimited?: boolean | string;
    defaultSearchParams?: any;
    columns: TableDataColumn[];
    data?: TableInsideData[][];
    private inputSetFactory;
    constructor(opts: TableData) {
        this.editable = false;
        this.deletable = false;
        this.addable = false;
        this.visible = true;
        Object.assign(this, opts);
    }
}

