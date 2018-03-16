import { ReservationRoutingModule } from './reservation-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ReservationRoutingModule
  ],
  declarations: [ReservationComponent
]
})
export class ReservationModule { }