import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { TaxReportComponent } from './tax-report/tax-report.component';
import { TaxRoutingModule } from './tax-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxComponent } from './tax.component';

@NgModule({
  imports: [CommonModule, SharedModule, TaxRoutingModule, DataDriveModule],
  declarations: [TaxComponent, TaxReportComponent],
})
export class TaxModule {}
