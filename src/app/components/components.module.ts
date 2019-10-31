import { EmployeePickerDialogComponent } from './../dialogs/employee-picker-dialog/employee-picker-dialog.component';
import { InputPromptDialogComponent } from './../dialogs/input-prompt-dialog/input-prompt-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbListModule, NbUserModule, NbIconModule, NbCardModule, NbSelectModule, NbCalendarRangeModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { TransactionDialogComponent } from '../dialogs/transaction-dialog/transaction-dialog.component';
import { SalesCardComponent } from './sales-card/sales-card.component';
import { SalesCardsComponent } from './sales-cards/sales-cards.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TransactionFinderComponent } from './transaction-finder/transaction-finder.component';
import { NgxMaskModule } from 'ngx-mask';
import { AssignedTransactionComponent } from './assigned-transaction/assigned-transaction.component';
import { CustomersInLocationComponent } from './customers-in-location/customers-in-location.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionStatusPickerDialogComponent } from '../dialogs/transaction-status-picker-dialog/transaction-status-picker-dialog.component';



@NgModule({
  declarations: [
    CustomerListComponent,
    SalesCardComponent,
    SalesCardsComponent,
    EmployeeListComponent,
    TransactionFinderComponent,
    AssignedTransactionComponent,
    CustomersInLocationComponent,
    TransactionListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbListModule,
    NbUserModule,
    NbIconModule,
    NbCardModule,
    NbSelectModule,
    NbButtonModule,
    NbCalendarRangeModule,
    NbInputModule,
    NgxMaskModule.forChild()
  ],
  entryComponents: [
    TransactionDialogComponent,
    InputPromptDialogComponent,
    EmployeePickerDialogComponent,
    TransactionStatusPickerDialogComponent
  ],
  exports: [
    CustomerListComponent,
    SalesCardComponent,
    SalesCardsComponent,
    EmployeeListComponent,
    TransactionFinderComponent,
    CustomersInLocationComponent,
    TransactionListComponent
  ]
})
export class ComponentsModule {}
