import { MyDatePickerComponent } from './../../inputs/my-date-picker/my-date-picker.component';
import { SharedModule } from './../../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataInputerComponent } from './data-inputer.component';
import { DataSearchComponent } from './data-search/data-search.component';
import { DataUpdateComponent } from './data-update/data-update.component';

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [DataInputerComponent,
    DataSearchComponent,
    DataUpdateComponent,
    MyDatePickerComponent
  ],
  exports: [DataInputerComponent]
})
export class DataInputerModule { }
