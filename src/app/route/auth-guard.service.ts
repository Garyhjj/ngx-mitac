import { map, catchError, tap } from 'rxjs/operators';
import { UtilService } from './../core/services/util.service';
import { UserUpdate } from './../core/actions/user.action';
import { MyStore } from './../core/store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthService } from './../core/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private $store: Store<MyStore>,
    private util: UtilService,
  ) {}

  checkAuth() {
    if (this.authService.checkAuth()) {
      return true;
    } else {
      const user = this.authService.user;
      if (user.rememberPWD) {
        const dismiss = this.util.showLoading2();
        return this.authService
          .login({
            userName: user.USER_NAME,
            password: user.password,
            remember: user.rememberPWD,
          })
          .pipe(
            map(() => true),
            tap(() => dismiss()),
            catchError(err => {
              dismiss();
              this.storeBeforeToLoginUrl();
              this.router.navigate(['/login']);
              if (err.status === 400) {
                this.$store.dispatch(new UserUpdate({ rememberPWD: false }));
              }
              return of(false);
            }),
          );
      } else {
        this.storeBeforeToLoginUrl();
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

  storeBeforeToLoginUrl() {
    localStorage.setItem('lastURL', window.location.pathname + window.location.search);
  }
  canActivate() {
    return this.checkAuth();
  }
  canActivateChild() {
    return this.checkAuth();
  }
}
