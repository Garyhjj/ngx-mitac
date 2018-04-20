import { EMPIComponent } from './eMPI.component';
import { SharedModule } from './../../shared/shared.module';
import { EMPIRoutingModule } from './eMPI-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanComponent } from './scan/scan.component';



@NgModule({
  imports: [CommonModule, EMPIRoutingModule, SharedModule],
  declarations: [
    EMPIComponent,
    ScanComponent
  ],
  providers: []
})
export class EMPIModule { }
