import { ChineseConv } from './chinese-conv.pipe';
import { NgModule } from '@angular/core';
import { MydatePipe } from './mydate.pipe';

@NgModule({
  imports: [],
  declarations: [MydatePipe, ChineseConv],
  exports: [MydatePipe, ChineseConv],
})
export class PipesModule {}
