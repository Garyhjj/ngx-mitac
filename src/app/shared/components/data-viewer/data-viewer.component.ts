import { DataDrive, DataViewSet } from './../../models/index';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent implements OnInit {

  _dataDrive: DataDrive;
  _viewSet: DataViewSet;

  @Input()
  set opts(opts: DataDrive){
    console.log(opts);
    this._dataDrive = opts;
    this._viewSet = opts.dataViewSet;
  };

  constructor() { }

  ngOnInit() {
  }

}
