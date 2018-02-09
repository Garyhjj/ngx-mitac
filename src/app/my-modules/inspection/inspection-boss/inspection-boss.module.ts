import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { InspectionBossRoutingModule } from './inspection-boss-routing';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionBossComponent } from './inspection-boss.component';
import { InspectionBossLinesComponent } from './inspection-boss-lines/inspection-boss-lines.component';
import { InspectionBossReportComponent } from './inspection-boss-report/inspection-boss-report.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionBossRoutingModule, DataDriveModule
  ],
  declarations: [
    InspectionBossComponent,
    InspectionBossLinesComponent,
    InspectionBossReportComponent
  ]
})
export class InspectionBossModule { }