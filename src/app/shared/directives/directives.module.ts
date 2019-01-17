import { AppEchartDirective } from './app-echarts.directive';
import { NgModule } from '@angular/core';
import { SignaturePadDirective } from './signature-pad.directive';

@NgModule({
  imports: [],
  declarations: [AppEchartDirective, SignaturePadDirective],
  exports: [AppEchartDirective, SignaturePadDirective],
})
export class DirectivesModule {}
