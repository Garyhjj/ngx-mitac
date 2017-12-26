import { EMPIComponent } from './eMPI.component';
import { SharedModule } from './../../shared/shared.module';
import { EMPIRoutingModule } from './eMPI-routing.module';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';



@NgModule({
  imports:      [ CommonModule, EMPIRoutingModule, SharedModule],
  declarations: [
    EMPIComponent
  ],
  providers:    [  ]
})
export class EMPIModule {}