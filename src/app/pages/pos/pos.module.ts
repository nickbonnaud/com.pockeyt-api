import { NgModule } from '@angular/core';
import { PosComponent } from './pos.component';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { NbCardModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [PosComponent],
  imports: [
    AppFormsModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule,
    NbSpinnerModule,
    CommonModule
  ]
})
export class PosModule { }
