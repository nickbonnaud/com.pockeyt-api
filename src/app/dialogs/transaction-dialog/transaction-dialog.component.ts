import { AssignedTransaction } from './../../models/transaction/assigned-transaction';
import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})
export class TransactionDialogComponent {
  @Input() transaction: AssignedTransaction;

  constructor(protected ref: NbDialogRef<TransactionDialogComponent>) {}

  close(): void {
    this.ref.close();
  }

}
