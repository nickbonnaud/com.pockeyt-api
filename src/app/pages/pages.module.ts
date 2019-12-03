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
import { BusinessDataModule } from './business-data/business-data.module';
import { OwnersModule } from './owners/owners.module';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { BankModule } from './bank/bank.module';
import { GeoFenceModule } from './geo-fence/geo-fence.module';



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
    BusinessDataModule,
    OwnersModule,
    BankModule,
    GeoFenceModule,
    OnBoardModule,
    NbMenuModule.forRoot()
  ],
  entryComponents: [WarningDialogComponent]
})
export class PagesModule { }
