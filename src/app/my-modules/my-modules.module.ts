import { ContentComponent } from './content/content.component';
import { ModulesSiderComponent } from './modules-sider/modules-sider.component';
import { SharedModule } from './../shared/shared.module';
import { MyModulesComponent } from './my-modules.component';
import { MyModulesRoutingModule } from './my-modules-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    MyModulesRoutingModule,
    SharedModule,
    TranslateModule,
  ],
  declarations: [MyModulesComponent, ModulesSiderComponent, ContentComponent],
  providers: [],
})
export class MyModulesModule {}
