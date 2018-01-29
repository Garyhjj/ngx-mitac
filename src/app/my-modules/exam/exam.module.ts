import { ExamRoutingModule } from './exam-routing.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamComponent } from './exam.component';

@NgModule({
  imports: [
    CommonModule, SharedModule, ExamRoutingModule
  ],
  declarations: [ExamComponent]
})
export class ExamModule { }