import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    SweetAlert2Module.forRoot(),
    ComponentsModule,
  ]
})
export class HomeModule { }
