import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class UtilService {

    constructor(
        private router: Router,
        private _message: NzMessageService
    ) { }

    errDeal(err) {
        if (err && !isNaN(err.status)) {
            switch (err.status) {
                case 403:
                    this.tokenTimeOut();
                    return;
                case 400:
                    return this._message.error(err.body, { nzDuration: 3000 });
                case 404:
                    return this._message.error('没找到资源', { nzDuration: 3000 });
                case 500:
                    return this._message.error('無法連接到服務器,請稍後重試！', { nzDuration: 3000 });

            }
        }
    }

    tokenTimeOut() {
        this._message.create('error', '授权已超时,请重新登录', { nzDuration: 5000 });
        this.router.navigate(['/login']);
    }

    toExcel(name: string, header: (string | number)[], data: (string | number)[][]) {
        if (!ExportJsonExcel) {
            this._message.error('由於瀏覽器不支持,該功能不可用,請升級瀏覽器或使用別的瀏覽器,如Chrome', { nzDuration: 4000 })
            return;
        }
        let option: ExportJsonExcelOptions = {} as ExportJsonExcelOptions;

        option.fileName = name;
        option.datas = [
            {
                sheetData: data,
                sheetHeader: header
            }
        ];
        const toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel(); //保存
        this._message.info('文件將被下載到瀏覽器的默認下載目錄中', { nzDuration: 4000 });
    }

    showGlobalSucMes(mes) {
        this._message.success(mes, { nzDuration: 3000 });
    }

    showGlobalErrMes(mes) {
        this._message.error(mes, { nzDuration: 3000 });
    }

}
