import { AuthService } from './../core/services/auth.service';
import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild }    from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  auth:boolean;
  constructor(private authService: AuthService){
    this.auth = this.authService.checkAuth();
  }
  canActivate() {
    return this.auth;
  }
  canActivateChild(): boolean {
    return this.auth;
  }
}
