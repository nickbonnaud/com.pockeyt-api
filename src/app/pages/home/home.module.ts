import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ComponentsModule } from 'src/app/components/components.module';
import { NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    SweetAlert2Module.forRoot(),
    ComponentsModule,
    NbCardModule,
  ]
})
export class HomeModule { }
