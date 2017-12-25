import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from './pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [CommonModule, PipesModule, NgZorroAntdModule, ReactiveFormsModule, FormsModule],
    declarations: [],
    exports: [CommonModule,PipesModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
    entryComponents: [],
    providers: []
})
export class SharedModule { }
