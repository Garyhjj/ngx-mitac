import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './route/app-routing.module';
import { breadcrumbReducer } from './core/reducers/breadcrumb.reducer';
import { userReducer } from './core/reducers/user.reducer';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    StoreModule.forRoot({breadcrumbReducer, userReducer})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
