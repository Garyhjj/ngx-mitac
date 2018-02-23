import { Breadcrumb_Clear } from './../core/actions/breadcrumb.action';
import { Router } from '@angular/router';
import { User_Logout } from './../core/actions/user.action';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../core/services/auth.service';
import { myStore, UserState } from './../core/store';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  auth:boolean;
  isLoginPage:boolean;
  user:UserState = {};
  mySub1: Subscription;
  mySub2: Subscription;
  mySub3: Subscription;
  constructor(
    private store$: Store<myStore>,
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit() {
    this.mySub1 = this.authService.authSubject.subscribe(a => {
      this.auth = a;
      if(!a) {
        this.route.navigate(['/login']);
      }
    });
    this.mySub2 = this.authService.loginPageSubject.subscribe(b => {this.isLoginPage = b});
    this.mySub3 = this.store$.select(s => s.userReducer).subscribe((u) =>this.user = u);
  }

  ngOnDestroy() {
    this.mySub1 && this.mySub1.unsubscribe();
    this.mySub2 && this.mySub1.unsubscribe();
    this.mySub3 && this.mySub1.unsubscribe();
  }

  canSeeEnd() {
    const privilege = this.authService.user.privilege;
    return privilege.find(p => p.FUNCTION_URL === 'User');
  }

  confirm() {
    this.loginOut()
  }

  loginOut() {
    this.route.navigate(['/login']);
    this.authService.clearTokenMes();
    this.store$.dispatch(new Breadcrumb_Clear());
    this.store$.dispatch(new User_Logout());
  }
}
