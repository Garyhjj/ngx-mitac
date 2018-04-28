import { ReservationService } from './shared/services/resvation.service';
import { ReservationRoutingModule } from './reservation-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ReservationGuard } from './reservation-guard.service';

@NgModule({
  imports: [CommonModule, SharedModule, ReservationRoutingModule],
  declarations: [ReservationComponent],
  providers: [ReservationService, ReservationGuard],
})
export class ReservationModule {}
