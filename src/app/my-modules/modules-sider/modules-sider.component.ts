import { filter } from 'rxjs/operators/filter';
import { Observable } from 'rxjs/Observable';
import { UtilService } from './../../core/services/util.service';
import { AuthService } from './../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';
import { MyStore, UserState, MyModule, Privilege } from './../../core/store';
import { Store } from '@ngrx/store';
import { BreadcrumbModel } from './../../core/models/breadcrumb.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { isArray } from '../../shared/utils';

@Component({
  selector: 'app-modules-sider',
  templateUrl: './modules-sider.component.html',
  styleUrls: ['./modules-sider.component.css'],
})
export class ModulesSiderComponent implements OnInit, OnDestroy {
  myModules: MyModule[];
  mySub: Subscription;
  myPrivilege: Privilege[];
  allInspectionTip = new BehaviorSubject(0);
  bossInspectionTip = new BehaviorSubject(0);
  bossInspectionReportTip = new BehaviorSubject(0);
  bossInspectionUndoneTip = new BehaviorSubject(0);
  bossInspectionAdminTip = new BehaviorSubject(0);
  equipInspectionTip = new BehaviorSubject(0);
  equipInspectionUndoneTip = new BehaviorSubject(0);
  equipInspectionAdminTip = new BehaviorSubject(0);
  allReservationTip = new BehaviorSubject(0);
  ITReservationUserTip = new BehaviorSubject(0);
  ITReservationAdminTip = new BehaviorSubject(0);
  @Input() isCollapsed;
  constructor(
    private store$: Store<MyStore>,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
  ) {}

  ngOnInit() {
    this.mySub = this.store$
      .select(s => s.userReducer)
      .do(user => {
        const modules = user.modules;
        this.observeInspection(modules);
        this.observeReservation(modules);
      })
      .subscribe(u => {
        this.myModules = u.modules;
        this.myPrivilege = u.privilege;
      });
    BreadcrumbModel.clear(this.store$);
  }
  next(s: BehaviorSubject<any>, t: number) {
    if (+t > -1) {
      s.next(t);
    }
  }
  observeReservation(modules: MyModule[]) {
    const next = this.next;
    const reservation = modules.find(d => d.MODULE_ID === 26031);
    if (reservation) {
      next(this.allReservationTip, reservation.TIPS);
      if (isArray(reservation.children) && reservation.children.length > 0) {
        const children = reservation.children;
        const user = children.filter(
          r => (r.MODULE_ID + '').indexOf('user') > -1,
        );
        const tip1 = user.map(u => u.TIPS).reduce((a, b) => a + b, 0);
        next(this.ITReservationUserTip, tip1);
        const admin = children.filter(
          r => (r.MODULE_ID + '').indexOf('admin') > -1,
        );
        const tip2 = admin.map(u => u.TIPS).reduce((a, b) => a + b, 0);
        next(this.ITReservationAdminTip, tip2);
      }
    }
  }
  observeInspection(modules: MyModule[]) {
    const next = this.next;
    const inspection = modules.find(d => d.MODULE_ID === 61);
    if (inspection) {
      next(this.allInspectionTip, inspection.TIPS);
      if (isArray(inspection.children) && inspection.children.length > 0) {
        const children = inspection.children;
        const bossInspection = children.find(c => c.MODULE_ID === 'boss');
        if (bossInspection) {
          next(this.bossInspectionTip, bossInspection.TIPS);
          if (
            isArray(bossInspection.children) &&
            bossInspection.children.length > 0
          ) {
            const bChildren = bossInspection.children;
            const report = bChildren.find(b => b.MODULE_ID === 'ownTaskTips');
            if (report) {
              next(this.bossInspectionReportTip, report.TIPS);
            }
            const ownUndone = bChildren.find(
              b => b.MODULE_ID === 'ownUndoneTips',
            );
            if (ownUndone) {
              next(this.bossInspectionUndoneTip, ownUndone.TIPS);
            }
            const admin = bChildren.find(b => b.MODULE_ID === 'adminTotalTips');
            if (ownUndone) {
              next(this.bossInspectionAdminTip, admin.TIPS);
            }
          }
        }
        const equipInspection = children.find(c => c.MODULE_ID === 'equip');
        if (equipInspection) {
          next(this.equipInspectionTip, equipInspection.TIPS);
          if (
            isArray(equipInspection.children) &&
            equipInspection.children.length > 0
          ) {
            const bChildren = equipInspection.children;
            const ownUndone = bChildren.find(
              b => b.MODULE_ID === 'ownUndoneTips',
            );
            if (ownUndone) {
              next(this.equipInspectionUndoneTip, ownUndone.TIPS);
            }
            const admin = bChildren.find(b => b.MODULE_ID === 'adminTotalTips');
            if (ownUndone) {
              next(this.equipInspectionAdminTip, admin.TIPS);
            }
          }
        }
      }
    }
  }
  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.mySub && this.mySub.unsubscribe();
  }

  canSeeModule(id) {
    return this.myModules && this.myModules.find(m => m.MODULE_ID === id);
  }

  canSeeFunction(id) {
    return this.myPrivilege && this.myPrivilege.find(m => m.FUNCTION_ID === id);
  }
  select(e: any) {
    if (!this.authService.checkAuth()) {
      return this.utilService.tokenTimeOut();
    }
    let target = e.target;
    const nodeName = target.nodeName.toLowerCase();
    if (nodeName === 'nz-badge' || nodeName === 'span') {
      target = target.parentNode;
    } else if (nodeName === 'sup') {
      try {
        target = target.parentNode.parentNode;
      } catch (e) {
        target = e.target;
      }
    } else if (nodeName === 'p') {
      try {
        target = target.parentNode.parentNode.parentNode.parentNode;
      } catch (e) {
        target = e.target;
      }
    }
    if (target.nodeName.toLowerCase() === 'li') {
      try {
        const span = target.querySelector('span');
        let targetText;
        if (span) {
          targetText = span.innerText;
        } else {
          targetText = target.innerText;
        }
        let top = target.parentNode.parentNode.parentNode;
        let routeName: string[] = [];
        if (top.className === 'ant-menu-item-group') {
          routeName.push(top.querySelector('div span').innerText);
          routeName = routeName.concat([
            top.parentNode.parentNode.parentNode.querySelector('div span')
              .innerText,
            targetText,
          ]);
        } else {
          routeName = [top.querySelector('div span').innerText, targetText];
        }
        routeName.unshift('應用中心');
        let navRoute;
        if ((navRoute = target.dataset.route)) {
          const url = 'modules' + navRoute;
          this.router.navigate([url]);
          let breadcrumbModel = new BreadcrumbModel([routeName, url, 1]);
          breadcrumbModel.update(this.store$);
        }
      } catch (e) {
        console.log('路由位置獲取失敗');
      }
    }
  }
}
