import { BoardComponent } from './board.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardRoutingModule } from './board-routing.module';
import { UrgentMaterialComponent } from './urgent-material/urgent-material.component';
import { DataViewerModule } from '../../shared/components/data-viewer/data-viewer.module';

@NgModule({
  imports: [CommonModule, BoardRoutingModule, SharedModule, DataViewerModule],
  declarations: [
    BoardComponent,
    UrgentMaterialComponent
  ],
  providers: []
})
export class BoardModule { }