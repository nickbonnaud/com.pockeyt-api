import { NgModule } from '@angular/core';
import { SalesCenterComponent } from './sales-center.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [SalesCenterComponent],
  imports: [
    ComponentsModule
  ]
})
export class SalesCenterModule { }
