import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { OnBoardComponent } from './on-board/on-board.component';
import { SalesCenterComponent } from './sales-center/sales-center.component';
import { CustomersCenterComponent } from './customers-center/customers-center.component';
import { ProfileComponent } from './profile/profile.component';
import { PhotosComponent } from './photos/photos.component';
import { BusinessDataComponent } from './business-data/business-data.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'onboard',
      component: OnBoardComponent
    },
    {
      path: 'sales',
      component: SalesCenterComponent
    },
    {
      path: 'customers',
      component: CustomersCenterComponent
    },
    {
      path: 'account/profile',
      component: ProfileComponent
    },
    {
      path: 'account/photos',
      component: PhotosComponent
    },
    {
      path: 'account/business-data',
      component: BusinessDataComponent
    },
    {
      path: '',
      redirectTo: 'home',
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
