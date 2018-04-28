import { DataDriveModule } from './../../shared/components/data-drive/data-drive.module';
import { BoardComponent } from './board.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardRoutingModule } from './board-routing.module';
import { UrgentMaterialComponent } from './urgent-material/urgent-material.component';
import { UrgentNoComponent } from './urgent-no/urgent-no.component';
import { EsdComponent } from './esd/esd.component';
import { BoardService } from './shared/services/board.service';
import { OspComponent } from './osp/osp.component';

@NgModule({
  imports: [CommonModule, BoardRoutingModule, SharedModule, DataDriveModule],
  declarations: [
    BoardComponent,
    UrgentMaterialComponent,
    UrgentNoComponent,
    EsdComponent,
    OspComponent,
  ],
  providers: [BoardService],
})
export class BoardModule {}
