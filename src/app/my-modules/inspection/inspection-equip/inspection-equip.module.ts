import { EquipGuard } from './equip-guard.service';
import { InspectionEquipService } from './shared/services/inspection-equip.service';
import { SharedModule } from './../../../shared/shared.module';
import { DataDriveModule } from './../../../shared/components/data-drive/data-drive.module';
import { InspectionEquipRoutingModule } from './inspection-equip-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionEquipComponent } from './inspection-equip.component';
import { InspectionEquipImprovementComponent } from './inspection-equip-improvement/inspection-equip-improvement.component';
import { InspectionEquipLinesComponent } from './inspection-equip-lines/inspection-equip-lines.component';
import { InspectionEquipListComponent } from './inspection-equip-list/inspection-equip-list.component';
import { InspectionEquipCheckListComponent } from './inspection-equip-checkList/inspection-equip-checkList.component';
import { InspectionEquipStatusComponent } from './inspection-equip-status/inspection-equip-status.component';
import { InspectionEquipHistoryComponent } from './inspection-equip-history/inspection-equip-history.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionEquipRoutingModule, DataDriveModule,
  ],
  declarations: [InspectionEquipComponent,
    InspectionEquipImprovementComponent,
    InspectionEquipLinesComponent,
    InspectionEquipListComponent,
    InspectionEquipCheckListComponent,
    InspectionEquipStatusComponent,
    InspectionEquipHistoryComponent
  ],
  providers: [InspectionEquipService, EquipGuard]
})
export class InspectionEquipModule { }
