import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmOrCancelDialogComponent } from './confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { NbCardModule, NbButtonModule, NbRadioModule, NbUserModule, NbListModule, NbCalendarRangeModule } from '@nebular/theme';
import { OwnerListDialogComponent } from './owner-list-dialog/owner-list-dialog.component';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { InputPromptDialogComponent } from './input-prompt-dialog/input-prompt-dialog.component';
import { EmployeePickerDialogComponent } from './employee-picker-dialog/employee-picker-dialog.component';
import { TransactionStatusPickerDialogComponent } from './transaction-status-picker-dialog/transaction-status-picker-dialog.component';
import { CalendarDialogComponent } from './calendar-dialog/calendar-dialog.component';



@NgModule({
  declarations: [
    ConfirmOrCancelDialogComponent,
    OwnerListDialogComponent,
    TransactionDialogComponent,
    InputPromptDialogComponent,
    EmployeePickerDialogComponent,
    TransactionStatusPickerDialogComponent,
    CalendarDialogComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbRadioModule,
    NbUserModule,
    NbListModule,
    NbCalendarRangeModule
  ],
  exports: [
    ConfirmOrCancelDialogComponent,
    OwnerListDialogComponent,
    TransactionDialogComponent,
    InputPromptDialogComponent,
    EmployeePickerDialogComponent,
    TransactionStatusPickerDialogComponent
  ]
})
export class DialogsModule { }
