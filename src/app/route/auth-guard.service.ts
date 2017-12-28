import { AuthService } from './../core/services/auth.service';
import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild }    from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService){
  }
  canActivate() {
    return this.authService.checkAuth();
  }
  canActivateChild(): boolean {
    return this.authService.checkAuth();
  }
  
}
