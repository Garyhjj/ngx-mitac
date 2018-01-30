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
      this.dataDriveService.initTableData(this.dataDrive, ds);
      final();
    }, (err) => { this.utilService.errDeal(err); final(); });

    this.dataDriveInit.emit(this.dataDrive);
  }
}
