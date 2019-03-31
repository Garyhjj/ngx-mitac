import { UtilService } from './../core/services/util.service';
import { MyStore } from './../core/store';
import { Store } from '@ngrx/store';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  loading = false;
  year = new Date().getFullYear();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store$: Store<MyStore>,
    private _notification: NzNotificationService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.authService.loginPageSubject.next(true);
    this.store$.select(s => s.userReducer).subscribe(user => {
      this.validateForm = this.fb.group({
        userName: [user.USER_NAME, Validators.required],
        password: [user.password, Validators.required],
        remember: [user.rememberPWD],
      });
    });
  }

  ngOnDestroy() {
    this.authService.loginPageSubject.next(false);
  }

  login() {
    this.loading = true;
    let value = this.validateForm.value;
    this.authService.login(value).subscribe(
      user => {
        const lastURL = localStorage.getItem('lastURL');
        this.router.navigateByUrl(lastURL ? lastURL : '/modules');
        localStorage.removeItem('lastURL');
        this.loading = false;
        this._notification.create(
          'success',
          '登录成功',
          `您好：${user.User.NICK_NAME}`,
        );
      },
      err => {
        this.loading = false;
        this.util.errDeal(err);
      },
    );
  }
}
