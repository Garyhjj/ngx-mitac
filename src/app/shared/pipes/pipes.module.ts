import { NgModule } from '@angular/core';
import { MydatePipe } from './mydate.pipe';

@NgModule({
  imports: [],
  declarations: [MydatePipe],
  exports: [MydatePipe]
})
export class PipesModule { }