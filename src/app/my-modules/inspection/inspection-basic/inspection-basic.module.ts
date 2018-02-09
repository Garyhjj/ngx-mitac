import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { InspectionBasicRoutingModule } from './inspection-basic-routing';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionBasicComponent } from './inspection-basic.component';
import { InspectionNameComponent } from './inspection-name/inspection-name.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionBasicRoutingModule, DataDriveModule
  ],
  declarations: [
    InspectionBasicComponent,
    InspectionNameComponent
]
})
export class InspectionBasicModule { }