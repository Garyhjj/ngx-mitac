import { UtilService } from './../../core/services/util.service';
import { AuthService } from './../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MyStore, UserState, MyModule, Privilege } from './../../core/store';
import { Store } from '@ngrx/store';
import { BreadcrumbModel } from './../../core/models/breadcrumb.model';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-end-sider',
  templateUrl: './end-sider.component.html',
  styleUrls: ['./end-sider.component.css'],
})
export class EndSiderComponent implements OnInit, OnDestroy {
  myModules: MyModule[];
  mySub: Subscription;
  myPrivilege: Privilege[];
  @Input() isCollapsed;
  constructor(
    private store$: Store<MyStore>,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
  ) {}

  ngOnInit() {
    this.mySub = this.store$.select(s => s.userReducer).subscribe(u => {
      this.myModules = u.modules;
      this.myPrivilege = u.privilege;
    });
    BreadcrumbModel.clear(this.store$);
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
  select(directive: any) {
    if (!this.authService.checkAuth()) {
      return this.utilService.tokenTimeOut();
    }
    const originalTar = directive.hostElement.nativeElement;
    let target = originalTar;
    const nodeName = target.nodeName.toLowerCase();
    if (nodeName === 'nz-badge' || nodeName === 'span') {
      target = target.parentNode;
    } else if (nodeName === 'sup') {
      try {
        target = target.parentNode.parentNode;
      } catch (e) {
        target = originalTar;
      }
    } else if (nodeName === 'p') {
      try {
        target = target.parentNode.parentNode.parentNode.parentNode;
      } catch (e) {
        target = originalTar;
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
          routeName = [
            directive.nzSubMenuComponent.trigger.nativeElement.textContent,
            targetText,
          ];
        }
        routeName.unshift('后台');
        let navRoute;
        if ((navRoute = target.dataset.route)) {
          const url = 'end' + navRoute;
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
