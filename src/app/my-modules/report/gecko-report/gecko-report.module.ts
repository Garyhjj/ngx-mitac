import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeckoShippingComponent } from './gecko-shipping/gecko-shipping.component';
import { GeckoReportComponent } from './gecko-report.component';
import { GeckoReportRoutingModule } from './gecko-report-routing.module';
import { DataDriveModule } from '../../../shared/components/data-drive/data-drive.module';
import { GeckoRmaComponent } from './gecko-rma/gecko-rma.component';
import { GeckoRepairComponent } from './gecko-repair/gecko-repair.component';

@NgModule({
  imports: [
    CommonModule,
    GeckoReportRoutingModule,
    DataDriveModule,
    SharedModule,
  ],
  declarations: [
    GeckoReportComponent,
    GeckoShippingComponent,
    GeckoRmaComponent,
    GeckoRepairComponent,
  ],
})
export class GeckoReportModule {}
