import { UserUpdate } from './../core/actions/user.action';
import { MyStore } from './../core/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../core/services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private $store: Store<MyStore>,
  ) {}

  checkAuth() {
    if (this.authService.checkAuth()) {
      return true;
    } else {
      const user = this.authService.user;
      if (user.rememberPWD) {
        return this.authService
          .login({
            userName: user.USER_NAME,
            password: user.password,
            remember: user.rememberPWD,
          })
          .map(() => true)
          .catch(err => {
            this.router.navigate(['/login']);
            if (err.status === 400) {
              this.$store.dispatch(new UserUpdate({ rememberPWD: false }));
            }
            return Observable.of(false);
          });
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
  canActivate() {
    return this.checkAuth();
  }
  canActivateChild() {
    return this.checkAuth();
  }
}
