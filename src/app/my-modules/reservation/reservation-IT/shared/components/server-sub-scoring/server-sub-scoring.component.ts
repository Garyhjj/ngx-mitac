import { AuthService } from './../../../../../../core/services/auth.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-server-sub-scoring',
  templateUrl: './server-sub-scoring.component.html',
  styleUrls: ['./server-sub-scoring.component.css'],
})
export class ServerSubScoringComponent implements OnInit, OnDestroy {
  @Input() dataChange: Observable<any[]>;
  sub: Subscription;
  subList = new Set();
  user = this.auth.user;
  d2: DataDrive;
  constructor(private auth: AuthService) {}

  ngOnInit() {}

  ngOnDestroy() {
    Array.from(new Set()).forEach((_: Subscription) => {
      // tslint:disable-next-line:no-unused-expression
      _ && _.unsubscribe();
    });
  }

  obData(d: DataDrive) {
    this.sub = this.dataChange.subscribe(list => d.selfUpdateTableData(list));
    this.subList.add(this.sub);
  }

  hideColumns(d: DataDrive) {
    const hideList = ['SCORE', 'USER_COMMENT', 'impression'];
    d.tableData.columns = d.tableData.columns.filter(
      c => hideList.indexOf(c.property) < 0,
    );
    d.dataViewSet.more.showAction = false;
  }

  getDataDrive1(d: DataDrive) {
    this.hideColumns(d);
    d.beforeInitTableData(res => {
      const myTask = [],
        others = [];
      res.forEach(l => {
          if (l.HANDLER !== this.user.EMPNO) {
            others.push(l);
          } else {
            myTask.push(l);
          }
      });
      this.d2.selfUpdateTableData(others);
      return myTask;
    });
    timer(10).subscribe(() => this.obData(d));
  }

  getDataDrive2(d: DataDrive) {
    this.d2 = d;
    this.hideColumns(d);
  }
}
