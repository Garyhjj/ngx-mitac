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
    private router: Router
  ) { }

  ngOnInit() {
  }

  getDataDrive(d: DataDrive) {
    d.setParamsOut('查看詳細');
    d.onParamsOut((d) => this.router.navigate(['/end/dataDrive/edit', d.ID]));
  }
}
