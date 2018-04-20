import { FileUploadComponent } from './components/inputs/file-upload/file-upload.component';
import { MySelectComponent } from './components/inputs/my-select/my-select.component';
import { PhotoUploadComponent } from './components/inputs/photo-upload/photo-upload.component';
import { ColleagueSearcherComponent } from './components/inputs/colleague-searcher/colleague-searcher.component';
import { MySwitchComponent } from './components/inputs/my-switch/my-switch.component';
import { MyCascaderComponent } from './components/inputs/my-cascader/my-cascader.component';
import { MyTimePickerComponent } from './components/inputs/my-time-picker/my-time-picker.component';
import { MyDatePickerComponent } from './components/inputs/my-date-picker/my-date-picker.component';
import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from './pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MxSelectComponent } from './components/inputs/mx-select/mx-select.component';
import { MxCheckboxComponent } from './components/inputs/mx-checkbox/mx-checkbox.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, PipesModule, NgZorroAntdModule,
        ReactiveFormsModule, FormsModule, TranslateModule],
    declarations: [
        PhotoViewerComponent,
        MxSelectComponent,
        MySelectComponent,
        MxCheckboxComponent,
        MyDatePickerComponent,
        MyTimePickerComponent,
        MyCascaderComponent,
        MySwitchComponent,
        ColleagueSearcherComponent,
        PhotoUploadComponent,
        FileUploadComponent
    ],
    exports: [
        TranslateModule,
        CommonModule,
        PipesModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        PhotoViewerComponent,
        MxSelectComponent,
        MySelectComponent,
        MxCheckboxComponent,
        MyDatePickerComponent,
        MyTimePickerComponent,
        MyCascaderComponent,
        MySwitchComponent,
        ColleagueSearcherComponent,
        PhotoUploadComponent,
        FileUploadComponent
    ],
    entryComponents: [],
    providers: []
})
export class SharedModule { }
