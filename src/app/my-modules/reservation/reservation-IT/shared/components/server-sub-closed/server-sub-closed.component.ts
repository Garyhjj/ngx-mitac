import { AuthService } from './../../../../../../core/services/auth.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DataDrive } from '../../../../../../shared/components/data-drive/shared/models';

@Component({
  selector: 'app-server-sub-closed',
  templateUrl: './server-sub-closed.component.html',
  styleUrls: ['./server-sub-closed.component.css'],
})
export class ServerSubClosedComponent implements OnInit, OnDestroy {
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

  getDataDrive1(d: DataDrive) {
    d.dataViewSet.more.showAction = false;
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
    d.dataViewSet.more.showAction = false;
  }
}
