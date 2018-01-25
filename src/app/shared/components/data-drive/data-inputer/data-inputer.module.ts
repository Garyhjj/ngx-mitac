import { PhotoUploadComponent } from './../../inputs/photo-upload/photo-upload.component';
import { ColleagueSearcherComponent } from './../../inputs/colleague-searcher/colleague-searcher.component';
import { MySwitchComponent } from './../../inputs/my-switch/my-switch.component';
import { MyCascaderComponent } from './../../inputs/my-cascader/my-cascader.component';
import { MyTimePickerComponent } from './../../inputs/my-time-picker/my-time-picker.component';
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
    MyDatePickerComponent,
    MyTimePickerComponent,
    MyCascaderComponent,
    MySwitchComponent,
    ColleagueSearcherComponent,
    PhotoUploadComponent
  ],
  exports: [DataInputerComponent]
})
export class DataInputerModule { }
