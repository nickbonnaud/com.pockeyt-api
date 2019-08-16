import { LayoutModule } from './../layout/layout.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgModule } from '@angular/core';
import { DashboardModule } from './dashboard/dashboard.module';



@NgModule({
  declarations: [PagesComponent],
  imports: [
    PagesRoutingModule,
    LayoutModule,
    DashboardModule
  ]
})
export class PagesModule { }
