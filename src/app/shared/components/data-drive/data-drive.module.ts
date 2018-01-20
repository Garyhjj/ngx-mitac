import { SharedModule } from './../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDriveComponent } from './data-drive.component';
import { DataViewerModule } from '../data-viewer/data-viewer.module';
import { DataDriveService } from './core/services/data-drive.service';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, DataViewerModule
  ],
  declarations: [DataDriveComponent,
    MenuComponent
],
  exports: [DataDriveComponent],
  providers: [DataDriveService]
})
export class DataDriveModule { }
