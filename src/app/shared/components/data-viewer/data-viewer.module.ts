import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewerComponent } from './data-viewer.component';
import { TableComponent } from './table/table.component';
import { SharedModule } from '../../shared.module';
import { FilterColumnComponent } from '../filter-column/filter-column.component';
import { ExamModule } from './exam/exam.module';

@NgModule({
  imports: [
    CommonModule, SharedModule, ExamModule
  ],
  declarations: [DataViewerComponent, TableComponent, FilterColumnComponent],
  exports: [DataViewerComponent, TableComponent, FilterColumnComponent],
  entryComponents: [DataViewerComponent]
})
export class DataViewerModule { }