import { DataDrive } from './../../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../../core/services/util.service';

@Component({
  selector: 'app-task-customer',
  templateUrl: './task-customer.component.html',
  styleUrls: ['./task-customer.component.css'],
})
export class TaskCustomerComponent implements OnInit {
  constructor(private util: UtilService) {}

  ngOnInit() {}

  getDataDrive(d: DataDrive) {
    d.onUpdateData(data => {
      data.LOOKUP_TYPE = 'PROJECT_CUSTOMER';
      data.DESCRIPTION = 'N/A';
      data.ENABLED_FLAG = 'Y';
      data.START_DATE =
        data.START_DATE || this.util.dateFormat(new Date(), 'YYYY-MM-DD');
    });
  }
}
