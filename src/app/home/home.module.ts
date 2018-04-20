import { ContentComponent } from './content/content.component';
import { SiderComponent } from './sider/sider.component';
import { SharedModule } from './../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  declarations: [
    HomeComponent,
    SiderComponent,
    ContentComponent
  ],
  providers: []
})
export class HomeModule { }
