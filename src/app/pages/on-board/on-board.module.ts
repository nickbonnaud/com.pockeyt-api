import { AppFormsModule } from './../../forms/app-forms.module';
import { NgModule } from '@angular/core';
import { OnBoardComponent } from './on-board.component';
import { NbCardModule, NbStepperModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [OnBoardComponent],
  imports: [
    ReactiveFormsModule,
    NbCardModule,
    NbStepperModule,
    AppFormsModule
  ]
})
export class OnBoardModule { }
