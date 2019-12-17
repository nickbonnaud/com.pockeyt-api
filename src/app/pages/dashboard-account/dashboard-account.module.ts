import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardAccountComponent } from './dashboard-account.component';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [DashboardAccountComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule,
    AppFormsModule,
    SweetAlert2Module.forChild()
  ]
})
export class DashboardAccountModule { }
