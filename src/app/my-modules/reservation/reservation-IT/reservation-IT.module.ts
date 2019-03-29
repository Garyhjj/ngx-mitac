import { ServerSubClosedComponent } from './shared/components/server-sub-closed/server-sub-closed.component';
import { ServerSubComponent } from './shared/components/server-sub/server-sub.component';
import { ITServerWholeComponent } from './IT-server-Whole/IT-server-Whole.component';
import { ImpressionListComponent } from './shared/components/impression-list/impression-list.component';
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
import { ITServerTrackComponent } from './IT-server-track/IT-server-track.component';
import { ITServerRateComponent } from './IT-server-rate/IT-server-rate.component';
import { ITServerBoardComponent } from './IT-server-board/IT-server-board.component';
import { ITServerAddComponent } from './IT-server-add/IT-server-add.component';
import { ServerSubScoringComponent } from './shared/components/server-sub-scoring/server-sub-scoring.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DataDriveModule,
    ReservationITRoutingModule,
  ],
  declarations: [
    ReservationITComponent,
    ApplicationITComponent,
    SelfApplicationITComponent,
    ITServerWorkspaceComponent,
    ImpressionListComponent,
    ITServerTrackComponent,
    ITServerRateComponent,
    ITServerBoardComponent,
    ITServerAddComponent,
    ITServerWholeComponent,
    ServerSubComponent,
    ServerSubScoringComponent,
    ServerSubClosedComponent,
  ],
  entryComponents: [
    ImpressionListComponent,
    ServerSubComponent,
    ServerSubScoringComponent,
    ServerSubClosedComponent,
  ],
  providers: [ReservationITService],
})
export class ReservationITModule {}
