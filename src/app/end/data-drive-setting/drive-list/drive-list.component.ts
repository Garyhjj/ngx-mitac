import { BreadcrumbModel } from './../../../core/models/breadcrumb.model';
import { myStore } from './../../../core/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DataDrive } from './../../../shared/components/data-drive/shared/models/index';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drive-list',
  templateUrl: './drive-list.component.html',
  styleUrls: ['./drive-list.component.css']
})
export class DriveListComponent implements OnInit {

  constructor(
    private router: Router,
    private store$: Store<myStore>
  ) { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {
    d.setParamsOut('查看詳細');
    d.onParamsOut((d) => {
      let breadcrumbModel = new BreadcrumbModel([['詳細配置'+d.ID], '/end/dataDrive/edit/'+ d.ID, 1]);
      breadcrumbModel.update(this.store$)
      // this.router.navigate(['/end/dataDrive/edit', d.ID])
    }
    );
  }
}
