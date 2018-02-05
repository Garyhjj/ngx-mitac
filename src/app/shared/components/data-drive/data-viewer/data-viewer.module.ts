import { QRComponent } from '../../QR/QR.component';
import { MyFlexPipe } from './../shared/pipes/my-flex.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewerComponent } from './data-viewer.component';
import { TableComponent } from './table/table.component';
import { SharedModule } from '../../../shared.module';
import { FilterColumnComponent } from '../filter-column/filter-column.component';
import { ExamPaperModule } from './exam-paper/exam-paper.module';

@NgModule({
  imports: [
    CommonModule, SharedModule, ExamPaperModule
  ],
  declarations: [DataViewerComponent, TableComponent, FilterColumnComponent, QRComponent, MyFlexPipe],
  exports: [DataViewerComponent, TableComponent, FilterColumnComponent, MyFlexPipe],
  entryComponents: [DataViewerComponent, QRComponent]
})
export class DataViewerModule { }