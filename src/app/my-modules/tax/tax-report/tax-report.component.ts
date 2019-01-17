import { DataDriveService } from './../../../shared/components/data-drive/core/services/data-drive.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataDrive } from '../../../shared/components/data-drive/shared/models';
import { of } from 'rxjs';
import { sortUtils } from '../../../shared/utils';

@Component({
  selector: 'app-tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.css'],
})
export class TaxReportComponent implements OnInit {
  @ViewChild('body') body: TemplateRef<any>;
  subList: { d: DataDrive; type: string }[] = [];
  typeList = [];
  hasFirstSearch = false;
  constructor(private dataDriveService: DataDriveService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.changeSearchWay(data => {
      console.log(data);
      if (!this.hasFirstSearch) {
        this.hasFirstSearch = true;
      }
      if (data.types) {
        this.typeList = data.types.split(',');
        this.subList = this.subList.filter(
          s => this.typeList.indexOf(s.type) > -1,
        );
      }
      if (this.subList.length > 0) {
        this.subList.forEach(s => {
          const sub = s.d;
          sub.addDefaultSearchParams(data);
          this.dataDriveService.updateViewData(sub);
        });
      }
      return of(1);
    });
    const viewer = d.viewerRegister(this.body);
    setTimeout(() => {
      d.switchViewType(viewer.type);
    }, 50);
  }

  getDataDriveSub(d: DataDrive, type) {
    this.subList.push({ d, type });
    d.addDefaultSearchParams({ type });
    d.beforeInitTableData(ds =>
      ds.sort((a, b) =>
        sortUtils.byDate(a.CREATION_DATE, b.CREATION_DATE, false),
      ),
    );
    if (this.hasFirstSearch) {
      this.dataDriveService.updateViewData(d);
    }
  }
}
