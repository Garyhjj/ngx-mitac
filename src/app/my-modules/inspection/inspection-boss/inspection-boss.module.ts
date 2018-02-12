import { InspectionBossService } from './shared/services/inspection-boss.service';
import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { InspectionBossRoutingModule } from './inspection-boss-routing';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionBossComponent } from './inspection-boss.component';
import { InspectionBossLinesComponent } from './inspection-boss-lines/inspection-boss-lines.component';
import { InspectionBossReportComponent } from './inspection-boss-report/inspection-boss-report.component';
import { InspectionBossImprovementComponent } from './inspection-boss-improvement/inspection-boss-improvement.component';
import { InspectionBossAttendanceComponent } from './inspection-boss-attendance/inspection-boss-attendance.component';
import { InspectionBossScheduleComponent } from './inspection-boss-schedule/inspection-boss-schedule.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionBossRoutingModule, DataDriveModule
  ],
  declarations: [
    InspectionBossComponent,
    InspectionBossLinesComponent,
    InspectionBossReportComponent,
    InspectionBossImprovementComponent,
    InspectionBossAttendanceComponent,
    InspectionBossScheduleComponent
],
  providers: [InspectionBossService]
})
export class InspectionBossModule { }