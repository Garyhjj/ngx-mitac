import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic.component';
import { ReservationDepartmentComponent } from './reservation-department/reservation-department.component';
import { BasicRoutingModule } from './basic-routing';
import { ReservationPersonComponent } from './reservation-person/reservation-person.component';
import { ResvationTimeComponent } from './resvation-time/resvation-time.component';
import { ApplicationImpressionComponent } from './application-impression/application-impression.component';
import { ReservationTypeComponent } from './reservation-type/reservation-type.component';

@NgModule({
  imports: [CommonModule, SharedModule, BasicRoutingModule, DataDriveModule],
  declarations: [
    BasicComponent,
    ReservationDepartmentComponent,
    ReservationPersonComponent,
    ResvationTimeComponent,
    ApplicationImpressionComponent,
    ReservationTypeComponent,
  ],
})
export class BasicModule {}
