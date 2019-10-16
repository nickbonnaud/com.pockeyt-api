import { AssignedTransaction } from './../../models/transaction/assigned-transaction';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'assigned-transaction',
  templateUrl: './assigned-transaction.component.html',
  styleUrls: ['./assigned-transaction.component.scss']
})
export class AssignedTransactionComponent {
  @Input() transaction: AssignedTransaction;

}
