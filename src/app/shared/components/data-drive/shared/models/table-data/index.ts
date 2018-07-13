export interface TableDataColumn {
  property: string;
  value: string;
  more?: {
    type?: {
      name: string;
      params?: any;
    };
    pipe?: {
      name: string;
      params: any[];
    };
    sortBy?: {
      name: string;
      params: any[];
    };
  };
}
export interface TableInsideData {
  property: string;
  value: string;
  hide?: boolean;
  checked?: boolean;
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
  refreshDataInterval?: number;
  columns: TableDataColumn[];
  data?: TableInsideData[][];
  endPagination?: {
    enable?: boolean;
    pageSize?: number;
  };
}

export class TableDataModel implements TableData {
  editable: boolean;
  addable: boolean;
  deletable: boolean;
  searchable?: boolean;
  visible: boolean;
  stopFirstInit?: boolean;
  isCompanyLimited?: boolean | string;
  defaultSearchParams?: any;
  refreshDataInterval?: number;
  columns: TableDataColumn[];
  data?: TableInsideData[][];
  endPagination?: {
    enable?: boolean;
    pageSize?: number;
  };
  private inputSetFactory;
  constructor(opts: TableData) {
    this.editable = false;
    this.deletable = false;
    this.addable = false;
    this.visible = true;
    Object.assign(this, opts);
  }
}
