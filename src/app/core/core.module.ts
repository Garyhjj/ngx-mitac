import { EncryptUtilService } from './services/encryptUtil.service';
import { HttpHeaderInterceptor } from './interceptors/http-header.interceptor';
import { AuthService } from './services/auth.service';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http'

@NgModule({
    imports: [CommonModule, HttpClientModule
    ],
    declarations: [],
    providers: [
        AuthService,
        EncryptUtilService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpHeaderInterceptor,
            multi: true,
        }
    ],
    exports: []
})
export class CoreModule {

    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
