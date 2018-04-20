import { InspectionService } from './shared/services/inspection.service';
import { InspectionRoutingModule } from './inspection-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectionComponent } from './inspection.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, InspectionRoutingModule
  ],
  declarations: [InspectionComponent],
  providers: [InspectionService]
})
export class InspectionModule { }
