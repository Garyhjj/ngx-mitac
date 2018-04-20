import { GeckoRmaComponent } from './gecko-report/gecko-rma/gecko-rma.component';
import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, ReportRoutingModule],
  declarations: [ReportComponent],
  providers: []
})

export class ReportModule { }
