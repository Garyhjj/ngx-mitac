import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ReservationService } from './shared/services/resvation.service';

@Injectable()
export class ReservationGuard implements CanActivate {
  constructor(private reservationService: ReservationService) {}
  canActivate() {
    const role = this.reservationService.role;
    return role === 1;
  }
}
