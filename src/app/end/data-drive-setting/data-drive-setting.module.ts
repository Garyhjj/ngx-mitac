import { DataDriveSettingService } from './shared/services/data-drive-setting.service';
import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDriveSettingComponent } from './data-drive-setting.component';
import { DriveListComponent } from './drive-list/drive-list.component';
import { SharedModule } from '../../shared/shared.module';
import { DataDriveSettingRoutingModule } from './data-drive-setting-routing.module';
import { DriveEditComponent } from './drive-edit/drive-edit.component';
import { DriveAPIComponent } from './drive-API/drive-API.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataDriveSettingRoutingModule,
    DataDriveModule,
  ],
  declarations: [
    DataDriveSettingComponent,
    DriveListComponent,
    DriveEditComponent,
    DriveAPIComponent,
  ],
  providers: [DataDriveSettingService],
})
export class DataDriveSettingModule {}
