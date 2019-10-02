import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmOrCancelDialogComponent } from './confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { NbCardModule, NbButtonModule, NbRadioModule, NbUserModule, NbListModule } from '@nebular/theme';
import { OwnerListDialogComponent } from './owner-list-dialog/owner-list-dialog.component';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';



@NgModule({
  declarations: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent, TransactionDialogComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbRadioModule,
    NbUserModule,
    NbListModule
  ],
  exports: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent, TransactionDialogComponent]
})
export class DialogsModule { }
