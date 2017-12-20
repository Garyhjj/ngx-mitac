import { breadcrumbReducer } from './core/reducers/breadcrumb.reducer';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SiderComponent } from './sider/sider.component';
import { ContentComponent } from './content/content.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SiderComponent,
    ContentComponent
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    StoreModule.forRoot({breadcrumbReducer}),
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
