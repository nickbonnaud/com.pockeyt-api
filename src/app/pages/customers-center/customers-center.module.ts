import { NgModule } from '@angular/core';
import { CustomersCenterComponent } from './customers-center.component';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [CustomersCenterComponent],
  imports: [
    ComponentsModule
  ]
})
export class CustomersCenterModule { }
