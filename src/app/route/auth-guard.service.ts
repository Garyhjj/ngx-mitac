import { Injectable }     from '@angular/core';
import { CanActivate, CanActivateChild }    from '@angular/router';

import { Store } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  auth:boolean;
  constructor(private store$: Store<any>){
    store$.select('authReducer').subscribe((store)=>this.auth = store.auth)
  }
  canActivate() {
    return this.auth;
  }
  canActivateChild(): boolean {
    return this.auth;
  }
}
