import { EndRoutingModule } from './end-routing.module';
import { EndSiderComponent } from './end-sider/end-sider.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndComponent } from './end.component';
import { SharedModule } from '../shared/shared.module';
import { ContentComponent } from './content/content.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EndRoutingModule
  ],
  declarations: [EndComponent, EndSiderComponent, ContentComponent]
})
export class EndModule { }