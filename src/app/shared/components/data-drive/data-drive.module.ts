import { SharedModule } from './../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDriveComponent } from './data-drive.component';
import { DataViewerModule } from '../data-viewer/data-viewer.module';
import { DataDriveService } from './core/services/data-drive.service';
import { MenuComponent } from './menu/menu.component';
import { DataInputerModule } from './data-inputer/data-inputer.module';

@NgModule({
  imports: [
    CommonModule, SharedModule, DataViewerModule, DataInputerModule
  ],
  declarations: [
    DataDriveComponent,
    MenuComponent
],
  exports: [DataDriveComponent],
  providers: [DataDriveService]
})
export class DataDriveModule { }
