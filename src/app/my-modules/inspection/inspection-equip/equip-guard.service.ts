import { InspectionEquipService } from './shared/services/inspection-equip.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class EquipGuard implements CanActivate {

    constructor(private inspectionEquipService: InspectionEquipService) {
    }
    canActivate() {
        const role = this.inspectionEquipService.role;
        return role === 1;
    }

}
