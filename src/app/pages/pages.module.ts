import { CommonModule } from '@angular/common';
import { LayoutModule } from './../layout/layout.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { OnBoardModule } from './on-board/on-board.module';



@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule,
    HomeModule,
    OnBoardModule
  ]
})
export class PagesModule { }
