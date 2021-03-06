import { NgModule } from '@angular/core';
import { BankComponent } from './bank.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { NbCardModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [BankComponent],
  imports: [
    ComponentsModule,
    AppFormsModule,
    NbCardModule,
    NbButtonModule,
    NbSpinnerModule,
    ReactiveFormsModule
  ]
})
export class BankModule { }
