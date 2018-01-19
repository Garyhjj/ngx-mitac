import { DataDrive, TableDataModel } from './../../../shared/models/index';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APPConfig } from '../../../shared/config/app.config';
import { NzModalService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { DataViewerComponent } from '../../../shared/components/data-viewer/data-viewer.component';

@Component({
  selector: 'app-urgent-material',
  templateUrl: './urgent-material.component.html',
  styleUrls: ['./urgent-material.component.css']
})
export class UrgentMaterialComponent implements OnInit {
  tableData: TableDataModel;
  dataDrive: DataDrive;
  isShowModal: boolean;
  attachFn: Function;
  constructor(
    private http: HttpClient,
    private modalService: NzModalService,
    private _message: NzMessageService
  ) { }

  ngOnInit() {
    this.dataDrive = this.prepare();
    this.tableData = this.dataDrive.tableData;
    this.dataDrive.isGetingData = true;
    this.http.get(APPConfig.baseUrl + this.dataDrive.APIs.search).subscribe((ds: any) => {
      if (ds.length && ds.length > 0) {
        const sortMes = Object.keys(ds[0]);
        this.tableData.columns.sort((a,b) => sortMes.indexOf(a.property) - sortMes.indexOf(b.property));
        const data = ds.map(d => {
          let trs = []
          for (let prop in d) {
            trs.push({ property: prop, value: d[prop] })
          }
          return trs;
        })
        this.tableData.data = data;
        setTimeout(() => this.dataDrive.isGetingData = false, 200);
      }
    })
  }
  showModal() {
    this.dataDrive.modalSataus = this.isShowModal = true;
    this._message.info('按下键盘Esc按钮可退出', { nzDuration: 5000 });
    if (!this.attachFn) {
      window.addEventListener('keydown', this.attachFn = (e) => e.keyCode === 27 && (this.dataDrive.modalSataus = this.isShowModal = false))
    }
  }

  prepare() {
    var a = new DataDrive({
      id: 1, APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo=' }, tableData: new TableDataModel({
        columns: [
          {
            property: 'LOT_NO', value: 'LOT_NO', type: {}
          },
          {
            property: 'CONTAINER_NO', value: 'CONTAINER_NO', type: {}
          },
          {
            property: 'CUSTOMS_TIME', value: 'CUSTOMS_TIME', type: {}
          },
          {
            property: 'ATA_MSL_TIME', value: 'ATA_MSL_TIME', type: {}
          },
          {
            property: 'WO_NO', value: 'WO_NO', type: {}
          },
          {
            property: 'PART_NO', value: 'PART_NO', type: {}
          },
          {
            property: 'SHORTAGE_QUANTITY', value: 'SHORTAGE_QUANTITY', type: {}
          },
          {
            property: 'SIC_NAME', value: 'SIC_NAME', type: {}
          },
          {
            property: 'RECEIVE_TIME', value: 'RECEIVE_TIME', type: {}
          },
          {
            property: 'IQC_TIME', value: 'IQC_TIME', type: {}
          },
          {
            property: 'INPUT_DATE', value: 'INPUT_DATE', type: {}
          },
          {
            property: 'IQC_FINISHED_TIME', value: 'IQC_FINISHED_TIME', type: {}
          }
        ]
      }
      )
    })
    return a;
  }

}
