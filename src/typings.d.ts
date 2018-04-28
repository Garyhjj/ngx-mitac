/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare class ExportJsonExcel {
  constructor(opts: ExportJsonExcelOptions);
  saveExcel();
}
interface ExportJsonExcelOptions {
  fileName: string;
  datas: {
    sheetData: (string | number)[][];
    sheetHeader: (string | number)[];
  }[];
}

declare class AraleQRCode {
  constructor(opts: { text: string; size: number });
  toDataURL(type, p);
}
