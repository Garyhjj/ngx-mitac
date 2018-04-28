import { InspectionBossService } from './shared/services/inspection-boss.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class BossGuard implements CanActivate {
  constructor(private inspectionBossService: InspectionBossService) {}
  canActivate() {
    const role = this.inspectionBossService.role;
    return role === 1;
  }
}
