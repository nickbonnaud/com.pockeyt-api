import { Transaction } from './../transaction/transaction';
import { Customer } from './customer';

export class ActiveCustomer {
  customer: Customer;
  transaction: Transaction;
  enteredAt: string;
}
