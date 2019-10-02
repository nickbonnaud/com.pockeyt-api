import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbListModule, NbUserModule, NbIconModule } from '@nebular/theme';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionDialogComponent } from '../dialogs/transaction-dialog/transaction-dialog.component';



@NgModule({
  declarations: [CustomerListComponent, TransactionListComponent],
  imports: [
    CommonModule,
    NbListModule,
    NbUserModule,
    NbIconModule
  ],
  entryComponents: [TransactionDialogComponent],
  exports: [CustomerListComponent, TransactionListComponent]
})
export class ComponentsModule { }
