import { DataDrive, DataViewSet } from '../../data-drive/shared/models/index';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent implements OnInit {

  _dataDrive: DataDrive;
  _viewSet: DataViewSet;

  @Input()
  set opts(opts: DataDrive) {
    this._dataDrive = opts;
    this._viewSet = opts.dataViewSet;
  }

  @Input()
  isModal: boolean;

  @Input() 
  set more(m:any) {
    if(m.actionRef) {
      this.actionRef = m.actionRef;
    }
  };

  actionRef: TemplateRef<void>;

  constructor() { }

  ngOnInit() {
    
  }

}
