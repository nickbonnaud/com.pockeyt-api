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
import { OwnersComponent } from './owners/owners.component';
import { BankComponent } from './bank/bank.component';
import { GeoFenceComponent } from './geo-fence/geo-fence.component';
import { PosComponent } from './pos/pos.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { RefundCenterComponent } from './refund-center/refund-center.component';


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
      path: 'refunds',
      component: RefundCenterComponent
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
      path: 'account/owners',
      component: OwnersComponent
    },
    {
      path: 'account/banking',
      component: BankComponent
    },
    {
      path: 'account/geo-fence',
      component: GeoFenceComponent
    },
    {
      path: 'account/pos-account',
      component: PosComponent
    },
    {
      path: 'account/settings',
      component: DashboardAccountComponent
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
