import { CommonModule } from '@angular/common';
import { LayoutModule } from './../layout/layout.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';
import { OnBoardModule } from './on-board/on-board.module';



@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule,
    DashboardModule,
    OnBoardModule
  ]
})
export class PagesModule { }
