import { DataDriveService } from './../../../../shared/components/data-drive/core/services/data-drive.service';
import { InspectionReportState } from './../../shared/models/index';
import { InspectionService } from './../../shared/services/inspection.service';
import { Observable } from 'rxjs/Observable';
import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { InspectionBossService } from './../shared/services/inspection-boss.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { InspectionReportLineState, InspectionReportHeader } from '../../shared/models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inspection-boss-report',
  templateUrl: './inspection-boss-report.component.html',
  styleUrls: ['./inspection-boss-report.component.css']
})
export class InspectionBossReportComponent implements OnInit {
  date = moment(new Date()).format('YYYY-MM-DD');

  issueCount = 0;
  tabIdx;
  dataDrive: DataDrive
  scheduleList: {
    INSPECT_NAME: string
    NAME_ID: number
    PERSON: string
    REPORT_ID: number
    SCHEDULE_HEADER_ID: number
  }[]
  constructor(
    private inspectionBossService: InspectionBossService,
    private inspectionService: InspectionService,
    private dataDriveService: DataDriveService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { schedule: any }) => {
        this.scheduleList = data.schedule;
        this.tabIdx = 0;
      });
  }

  tabChange(idx) {
    if (this.dataDrive) {
      // 修改索參數 
      this.dataDrive.addDefaultSearchParams({ header_id: this.scheduleList[idx].REPORT_ID });
      // 重新獲取數據
      this.dataDriveService.updateViewData(this.dataDrive);
    }
  }

  getDataDrive(d: DataDrive) {
    this.dataDrive = d;

    // 配置搜索參數
    this.dataDrive.addDefaultSearchParams({ header_id: this.scheduleList[this.tabIdx].REPORT_ID });

    // 表格渲染前的計算問題數
    this.dataDrive.beforeInitTableData(data => {
      this.issueCount = 0;
      data.forEach(c => {
        if (c.PROBLEM_FLAG === 'Y') {
          this.issueCount++;
        }
      })
    })
    const mayHide = ['PROBLEM_TYPE', 'PROBLEM_DESC', 'PROBLEM_PICTURES', 'OWNER_EMPNO'];

    // update表單初始化，增加驗證及隱藏
    this.dataDrive.onUpdateFormShow((fg, sub, inputList) => {
      const val: InspectionReportLineState = fg.value;
      if (val.PROBLEM_FLAG !== 'Y') {
        inputList.forEach(c => {
          if (mayHide.indexOf(c.property) > -1) {
            c.isHide = true;
          }
        });
      }
      fg.get('PROBLEM_FLAG').valueChanges.subscribe((f) => {
        const isHide = f !== 'Y';
        inputList.forEach(c => {
          if (mayHide.indexOf(c.property) > -1) {
            c.isHide = isHide;
          }
        });
      })
    })

    // update表單提交前的最後關卡
    this.dataDrive.beforeUpdateSubmit((fg, sub) => {
      const val: InspectionReportLineState = fg.value;
      if (val.PROBLEM_FLAG === 'Y') {
        if (!val.PROBLEM_DESC) {
          sub.next('請輸入問題描述');
          return false;
        }
        if (!val.PROBLEM_TYPE) {
          sub.next('請輸入問題類別');
          return false;
        }
      }
    })

    // 最後修改update的對象
    this.dataDrive.onUpdateData((data: InspectionReportLineState) => {
      if (!data.ACTION_DESC) {
        if (data.PROBLEM_FLAG === 'Y') {
          data.PROBLEM_STATUS = data.OWNER_EMPNO ? 'Waiting' : 'New';
        } else {
          data.PROBLEM_STATUS = 'Done';
        }
      }
      if (data.PROBLEM_FLAG !== 'Y') {
        mayHide.forEach(m => data[m] = '');
      } else {

      }
      return data;
    })

    // 改寫默認的更新方式
    this.dataDrive.changeUpdateWay((data: InspectionReportLineState) => {
      const header_id = this.scheduleList[this.tabIdx].REPORT_ID;
      const user = this.inspectionService.user;
      const reportHeader: InspectionReportHeader = {
        HEADER_ID: header_id,
        SCHEDULE_HEADER_ID: this.scheduleList[this.tabIdx].SCHEDULE_HEADER_ID,
        COMPANY_NAME: user.COMPANY_ID,
        TYPE: 'boss',
        INSPECTOR_NAME: this.scheduleList[this.tabIdx].PERSON,
        INSPECT_DATE: this.date
      }
      data.COMPANY_NAME = user.COMPANY_ID;
      data.HEADER_ID = header_id;
      data.INSPECT_DATE = this.date;
      const report: InspectionReportState = {
        Header: reportHeader,
        Lines: [data]
      }
      return this.inspectionService.uploadReport(report).do((id: number) => { this.scheduleList[this.tabIdx].REPORT_ID = id });
    })
  }
}
