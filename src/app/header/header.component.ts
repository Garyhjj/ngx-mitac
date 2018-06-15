import { AppService } from './../core/services/app.service';
import { BreadcrumbClear } from './../core/actions/breadcrumb.action';
import { Router } from '@angular/router';
import { UserLogout } from './../core/actions/user.action';
import { Observable, Subscription } from 'rxjs';
// tslint:disable-next-line:import-blacklist
import { map } from 'rxjs/operators';
import { AuthService } from './../core/services/auth.service';
import { MyStore, UserState } from './../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { isArray } from '../shared/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  auth: boolean;
  isLoginPage: boolean;
  user: UserState = {};
  mySub1: Subscription;
  mySub2: Subscription;
  mySub3: Subscription;
  tips: Observable<number>;
  constructor(
    private store$: Store<MyStore>,
    private authService: AuthService,
    private route: Router,
    private appService: AppService,
  ) {}

  ngOnInit() {
    this.mySub1 = this.authService.authSubject.subscribe(a => {
      this.auth = a;
      if (!a) {
      } else {
        setTimeout(() => {
          this.appService.getAllTips();
        }, 100);
      }
    });
    this.mySub2 = this.authService.loginPageSubject.subscribe(b => {
      this.isLoginPage = b;
    });
    this.mySub3 = this.store$
      .select(s => s.userReducer)
      .subscribe(u => (this.user = u));
    this.tips = this.store$.select(s => s.userReducer).pipe(
      map(user => user.modules || []),
      map(ms => ms.map(m => m.TIPS || 0)),
      map(ts => {
        if (Array.isArray(ts)) {
          return ts.reduce((a, b) => a + b, 0);
        }
        return 0;
      }),
    );
  }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.mySub1 && this.mySub1.unsubscribe();
    // tslint:disable-next-line:no-unused-expression
    this.mySub2 && this.mySub1.unsubscribe();
    // tslint:disable-next-line:no-unused-expression
    this.mySub3 && this.mySub1.unsubscribe();
  }

  canSeeEnd() {
    const privilege = this.authService.user.privilege;
    return isArray(privilege) && privilege.find(p => p.FUNCTION_ID === 42);
  }

  confirm() {
    this.loginOut();
  }

  loginOut() {
    this.route.navigate(['/login']);
    this.authService.clearTokenMes();
    this.store$.dispatch(new BreadcrumbClear());
    this.store$.dispatch(new UserLogout());
  }
}
