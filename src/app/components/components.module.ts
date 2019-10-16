import { ReactiveFormsModule } from '@angular/forms';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbListModule, NbUserModule, NbIconModule, NbCardModule, NbSelectModule, NbCalendarRangeModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionDialogComponent } from '../dialogs/transaction-dialog/transaction-dialog.component';
import { SalesCardComponent } from './sales-card/sales-card.component';
import { SalesCardsComponent } from './sales-cards/sales-cards.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { TransactionFinderComponent } from './transaction-finder/transaction-finder.component';
import { NgxMaskModule } from 'ngx-mask';
import { AssignedTransactionComponent } from './assigned-transaction/assigned-transaction.component';



@NgModule({
  declarations: [
    CustomerListComponent,
    TransactionListComponent,
    SalesCardComponent,
    SalesCardsComponent,
    EmployeeListComponent,
    TransactionFinderComponent,
    AssignedTransactionComponent
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
  entryComponents: [TransactionDialogComponent],
  exports: [
    CustomerListComponent,
    TransactionListComponent,
    SalesCardComponent,
    SalesCardsComponent,
    EmployeeListComponent,
    TransactionFinderComponent
  ]
})
export class ComponentsModule {}
