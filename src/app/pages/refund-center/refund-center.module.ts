import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { RefundCenterComponent } from './refund-center.component';



@NgModule({
  declarations: [RefundCenterComponent],
  imports: [
    ComponentsModule
  ]
})
export class RefundCenterModule { }
