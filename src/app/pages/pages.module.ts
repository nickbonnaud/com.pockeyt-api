import { CommonModule } from '@angular/common';
import { LayoutModule } from './../layout/layout.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { OnBoardModule } from './on-board/on-board.module';
import { NbMenuModule } from '@nebular/theme';
import { SalesCenterComponent } from './sales-center/sales-center.component';
import { CustomersCenterComponent } from './customers-center/customers-center.component';



@NgModule({
  declarations: [PagesComponent, SalesCenterComponent, CustomersCenterComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule,
    HomeModule,
    OnBoardModule,
    NbMenuModule.forRoot()
  ]
})
export class PagesModule { }
