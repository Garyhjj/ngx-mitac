import { ReservationITService } from './shared/services/reservaton-IT.service';
import { ReservationITRoutingModule } from './reservation-IT-routing';
import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationITComponent } from './reservation-IT.component';
import { SharedModule } from '../../../shared/shared.module';
import { ApplicationITComponent } from './application-IT/application-IT.component';
import { SelfApplicationITComponent } from './self-application-IT/self-application-IT.component';
import { ITServerWorkspaceComponent } from './IT-server-workspace/IT-server-workspace.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, DataDriveModule, ReservationITRoutingModule
  ],
  declarations: [ReservationITComponent,
    ApplicationITComponent,
    SelfApplicationITComponent,
    ITServerWorkspaceComponent
],
  providers: [ReservationITService]
})
export class ReservationITModule { }