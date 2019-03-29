import { DataDriveModule } from './../shared/components/data-drive/data-drive.module';
import { TempDDCComponent } from './temp-ddc/temp-ddc.component';
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
    DataDriveModule
  ],
  declarations: [MyModulesComponent, ModulesSiderComponent, ContentComponent, TempDDCComponent],
  providers: [],
})
export class MyModulesModule {}
