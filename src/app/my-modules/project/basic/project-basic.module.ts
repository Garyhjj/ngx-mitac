import { MailSettingComponent } from './mail-setting/mail-setting.component';
import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { SharedModule } from './../../../shared/shared.module';
import { ProjectBasicRoutingModule } from './project-basic-routing';
import { ProjectBasicComponent } from './project-basic.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTypeComponent } from './project-type/project-type.component';
import { TaskBuComponent } from './task-bu/task-bu.component';
import { TaskCustomerComponent } from './task-customer/task-customer.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectBasicRoutingModule,
    SharedModule,
    DataDriveModule,
  ],
  declarations: [
    ProjectBasicComponent,
    ProjectTypeComponent,
    TaskBuComponent,
    TaskCustomerComponent,
    MailSettingComponent,
  ],
})
export class ProjectBasicModule {}
