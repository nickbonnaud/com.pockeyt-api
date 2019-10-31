import { Customer } from './../../models/customer/customer';
import { Transaction } from './../../models/transaction/transaction';
import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent {
  @Input() transaction: Transaction;
  @Input() customer: Customer;

  constructor(protected ref: NbDialogRef<TransactionDialogComponent>) {}

  close(): void {
    this.ref.close();
  }

}
