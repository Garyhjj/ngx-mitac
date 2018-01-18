import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewerComponent } from './data-viewer.component';
import { TableComponent } from './table/table.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [DataViewerComponent, TableComponent],
  exports: [DataViewerComponent, TableComponent]
})
export class DataViewerModule { }