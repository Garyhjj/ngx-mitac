import { myStore } from './../core/store';
import { Store } from '@ngrx/store';
import { AuthService } from './../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router }            from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  validateForm:FormGroup;
  loading:boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store$: Store<myStore>,
    private _notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.authService.loginPageSubject.next(true);
    this.store$.select((s) =>s.userReducer).subscribe((user) => {
      this.validateForm = this.fb.group({
        userName:[user.USER_NAME, Validators.required],
        password:[user.password, Validators.required],
        remember:[user.rememberPWD]
      })
    })
  }

  ngOnDestroy() {
    this.authService.loginPageSubject.next(false);
  }

  login() {
    this.loading = true;
    let value = this.validateForm.value;
    this.authService.login(value).subscribe((user) => {
      this.router.navigate(['/home']);
      this.loading = false;
      this._notification.create('success','登录成功',`您好：${user.User.NICK_NAME}`)
    },(err) => {this.loading = false;console.log(err)});
  }
}
