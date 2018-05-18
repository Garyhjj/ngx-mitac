export interface AdditionalFn {
  filterColumn?: boolean;
  fullScreen?: boolean;
  changeBodyFontSize?: boolean;
  changeHeaderFontSize?: boolean;
  menu?: boolean;
  toExcel?: boolean;
  addItem?: boolean;
  mutiUpdate?: boolean;
  switchViewType?: string[];
  LinkToPhone?: {
    name: string;
    url: string;
  };
}
