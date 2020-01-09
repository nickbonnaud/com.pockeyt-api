import { CommonModule } from '@angular/common';
import { AppFormsModule } from './../../forms/app-forms.module';
import { NgModule } from '@angular/core';
import { OnBoardComponent } from './on-board.component';
import { NbCardModule, NbStepperModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [OnBoardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    NbSpinnerModule,
    AppFormsModule,
    SweetAlert2Module.forChild()
  ]
})
export class OnBoardModule {}
