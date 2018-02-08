import { PhotoViewerComponent } from './components/photo-viewer/photo-viewer.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from './pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MxSelectComponent } from './components/inputs/mx-select/mx-select.component';
import { MxCheckboxComponent } from './components/inputs/mx-checkbox/mx-checkbox.component';


@NgModule({
    imports: [CommonModule, PipesModule, NgZorroAntdModule, ReactiveFormsModule, FormsModule],
    declarations: [PhotoViewerComponent, MxSelectComponent, MxCheckboxComponent],
    exports: [
        CommonModule,
        PipesModule, 
        NgZorroAntdModule, 
        FormsModule, 
        ReactiveFormsModule, 
        PhotoViewerComponent,
        MxSelectComponent,
        MxCheckboxComponent
    ],
    entryComponents: [],
    providers: [ ]
})
export class SharedModule { }
