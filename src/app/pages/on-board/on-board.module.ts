import { CommonModule } from '@angular/common';
import { AppFormsModule } from './../../forms/app-forms.module';
import { NgModule } from '@angular/core';
import { OnBoardComponent } from './on-board.component';
import { NbCardModule, NbStepperModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [OnBoardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    AppFormsModule
  ]
})
export class OnBoardModule { }
