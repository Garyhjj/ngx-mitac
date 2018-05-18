import { NgZorroAntdModule } from 'ng-zorro-antd';
import { environment } from './../environments/environment';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './route/app-routing.module';
import { breadcrumbReducer } from './core/reducers/breadcrumb.reducer';
import { userReducer } from './core/reducers/user.reducer';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
// import { ServiceWorkerModule } from '@angular/service-worker';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    // ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    StoreModule.forRoot({ breadcrumbReducer, userReducer }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgZorroAntdModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
