import { Observable } from 'rxjs/Observable';
import { DataDrive, TableDataModel } from './shared/models/index';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPConfig } from '../../../shared/config/app.config';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { DataDriveService } from './core/services/data-drive.service';
import { UtilService } from '../../../core/services/util.service';


@Component({
  selector: 'app-data-drive',
  templateUrl: './data-drive.component.html',
  styleUrls: ['./data-drive.component.css']
})
export class DataDriveComponent implements OnInit {

  tableData: TableDataModel;
  dataDrive: DataDrive;
  isShowModal = Observable.of(false);
  attachFn: Function;
  private _name: string;
  @Input()
  set name(n: string) {
    this._name = n;
  }

  @Output() dataDriveInit: EventEmitter<DataDrive> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private modalService: NzModalService,
    private _message: NzMessageService,
    private dataDriveService: DataDriveService,
    private utilService: UtilService
  ) { }

  async ngOnInit() {
    this.dataDrive = await this.dataDriveService.initDataDrive(this._name);
    if (!this.dataDrive) {
      return;
    }
    this.tableData = this.dataDrive.tableData;
    this.dataDrive.isGetingData = true;
    this.isShowModal = this.dataDrive.observeIsShowModal();
    const final = () => setTimeout(() => this.dataDrive.isGetingData = false, 200);
    this.dataDriveService.getInitData(this.dataDrive).subscribe((ds: any) => {
      if (ds.length && ds.length > 0) {
        const sortMes = Object.keys(ds[0]);
        // 根据返回的数据筛选已配置的列
        this.tableData.columns = this.tableData.columns.filter(c => sortMes.indexOf(c.property) > -1);
        this.tableData.columns.sort((a, b) => sortMes.indexOf(a.property) - sortMes.indexOf(b.property));
        const data = ds.map(d => {
          const trs = [];
          for (const prop in d) {
            if (Object.prototype.hasOwnProperty.call(d, prop)) {
              trs.push({ property: prop, value: d[prop] });
            }
          }
          return trs;
        });
        this.tableData.data = data;
        final();
      }
    }, (err) => { this.utilService.errDeal(err); final(); });

    this.dataDriveInit.emit(this.dataDrive);
  }
}
