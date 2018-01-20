import { InputSet } from '../input/index';
import { InputSetFactory } from '../input';
export interface TableData {
    editable?: boolean;
    addable?: boolean;
    deletable?: boolean;
    visible?: boolean;
    searchable?: boolean;
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
    private inputSetFactory;
    constructor(opts: TableData, inputSetFactory = InputSetFactory) {
        this.inputSetFactory = inputSetFactory;
        this.editable = false;
        this.deletable = false;
        this.addable = false;
        this.visible = true;
        Object.assign(this, opts);
        this.columns = this.columns.map(c => {
            c.type = c.type || {};
            c.type.InputOpts = new this.inputSetFactory(c.type.InputOpts);
            return c;
        });
    }
}
export interface DataType {
    InputOpts?: InputSet;
}
