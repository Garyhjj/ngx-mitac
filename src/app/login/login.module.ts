import { SharedModule } from './../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [CommonModule, LoginRoutingModule, SharedModule],
  declarations: [
    LoginComponent
  ],
  providers: []
})
export class LoginModule { }
