import { FormatService } from './services/format.service';
import { MyErrorHandlerService } from './services/myErrorHandler.service';
import { CacheService } from './services/cache.service';
import { UtilService } from './services/util.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthGuard } from './../route/auth-guard.service';
import { EncryptUtilService } from './services/encryptUtil.service';
import { HttpHeaderInterceptor } from './interceptors/http-header.interceptor';
import { AuthService } from './services/auth.service';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxValidatorExtendService } from './services/ngx-validator-extend.service';
import { AppService } from './services/app.service';
import { Store } from '@ngrx/store';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [],
  providers: [
    NgxValidatorExtendService,
    NzNotificationService,
    NzMessageService,
    AppService,
    CacheService,
    AuthService,
    EncryptUtilService,
    UtilService,
    AuthGuard,
    MyErrorHandlerService,
    FormatService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: MyErrorHandlerService,
      deps: [HttpClient, Store],
    },
  ],
  exports: [],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only',
      );
    }
  }
}
