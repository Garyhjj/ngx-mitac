export interface TableDataColumn {
    property: string;
    value: string;
    more?: {
        pipe?:{
            name:string,
            params:any[]
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
    columns: TableDataColumn[];
    data?: TableInsideData[][];
}

export class TableDataModel implements TableData {
    editable: boolean;
    addable: boolean;
    deletable: boolean;
    visible: boolean;
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

