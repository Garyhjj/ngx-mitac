import {
  isSelfComponent,
  isSelfTemplateRef,
} from './../shared/models/viewer/index';
import { Subscription } from 'rxjs';
import { ProjectTreeComponent } from './../../../../my-modules/project/shared/components/project-tree/project-tree.component';
import { TableDataColumn } from './../shared/models/table-data/index';
import { DataDrive, DataViewSet } from '../../data-drive/shared/models/index';
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css'],
})
export class DataViewerComponent implements OnInit, OnDestroy {
  _dataDrive: DataDrive;
  _viewSet: DataViewSet;
  @ViewChild('selfContainer', { read: ViewContainerRef })
  container: ViewContainerRef;
  componentRef: ComponentRef<any>;
  sub: Subscription;

  @Input()
  set opts(opts: DataDrive) {
    this._dataDrive = opts;
    this._viewSet = opts.dataViewSet;
  }

  @Input() isModal: boolean;

  @Input()
  set more(m: any) {
    if (m.actionRef) {
      this.actionRef = m.actionRef;
    }
    if (m.tableCellRef) {
      this.tableCellRef = m.tableCellRef;
    }
    if (m.headerCellRef) {
      this.headerCellRef = m.headerCellRef;
    }
    if (m.headerCellStyle) {
      this.headerCellStyle = m.headerCellStyle;
    }
    if (m.bodyCellStyle) {
      this.bodyCellStyle = m.bodyCellStyle;
    }
  }
  tableCellRef: TemplateRef<void>;
  actionRef: TemplateRef<void>;
  headerCellRef: TemplateRef<void>;
  headerCellStyle: (TableDataColumn) => any;
  bodyCellStyle: (data: any, property: string) => any;
  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.sub = this._dataDrive.viewerChange.subscribe(
      (t: { type: string; params: any; container: any }) => {
        const { type, params, container } = t;
        if (typeof type === 'string') {
          if (isSelfComponent(type)) {
            this.createComponent(container, params);
          } else if (isSelfTemplateRef(type)) {
            this.createEmbeddedView(container, params);
          } else {
            this.container.clear();
          }
        }
      },
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createComponent(component, params) {
    this.container.clear();
    const factory: ComponentFactory<
      any
    > = this.resolver.resolveComponentFactory(component);
    this.componentRef = this.container.createComponent(factory);
    if (typeof params === 'object') {
      Object.assign(this.componentRef.instance, params);
    }
  }

  createEmbeddedView(templateRef, context = {}) {
    this.container.clear();
    this.container.createEmbeddedView(templateRef, context);
  }
}
