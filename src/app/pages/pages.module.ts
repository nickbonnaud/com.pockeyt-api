import { CommonModule } from '@angular/common';
import { LayoutModule } from './../layout/layout.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { OnBoardModule } from './on-board/on-board.module';
import { NbMenuModule } from '@nebular/theme';
import { SalesCenterModule } from './sales-center/sales-center.module';
import { CustomersCenterModule } from './customers-center/customers-center.module';
import { ProfileModule } from './profile/profile.module';
import { PhotosModule } from './photos/photos.module';



@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule,
    HomeModule,
    SalesCenterModule,
    CustomersCenterModule,
    ProfileModule,
    PhotosModule,
    OnBoardModule,
    NbMenuModule.forRoot()
  ]
})
export class PagesModule { }
