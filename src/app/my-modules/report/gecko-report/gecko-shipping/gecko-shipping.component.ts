import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataDriveService } from '../../../../shared/components/data-drive/core/services/data-drive.service';
import { DataDriveSettingComponent } from '../../../../end/data-drive-setting/data-drive-setting.component';
import { DataDrive } from '../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-gecko-shipping',
  templateUrl: './gecko-shipping.component.html',
  styleUrls: ['./gecko-shipping.component.css'],
})
export class GeckoShippingComponent implements OnInit {
  ggNO: string;
  ggLine: number;
  isDetail = false;
  detailData: DataDrive;

  constructor(public dataDriveService: DataDriveService) {}

  ngOnInit() {}

  /**
   * 查看GG单下的SN
   * @param data
   */
  toDetail(data) {
    this.ggNO = data.MSL_GG_NO;
    this.ggLine = data.GG_LINE_ID;
    this.isDetail = true;
    this.detailData.addDefaultSearchParams({
      gg_no: this.ggNO,
      gg_line_id: this.ggLine,
    });
    this.dataDriveService.updateViewData(this.detailData);
  }

  toCancel() {
    this.isDetail = false;
    // this.detailData.addDefaultSearchParams({ gg_no: "d",gg_line_id :1});
    // this.dataDriveService.updateViewData(this.detailData);
    this.detailData.selfUpdateTableData([]);
  }

  getDetailDrive(d: DataDrive) {
    this.detailData = d;
  }
}
