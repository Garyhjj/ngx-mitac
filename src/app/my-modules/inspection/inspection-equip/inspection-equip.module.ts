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

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionEquipRoutingModule, DataDriveModule,
  ],
  declarations: [InspectionEquipComponent,
    InspectionEquipImprovementComponent,
    InspectionEquipLinesComponent,
    InspectionEquipListComponent,
    InspectionEquipCheckListComponent
]
})
export class InspectionEquipModule { }