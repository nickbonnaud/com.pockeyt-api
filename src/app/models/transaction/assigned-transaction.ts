import { Transaction } from './transaction';
import { Customer } from './../customer/customer';

export class AssignedTransaction {
  customer: Customer;
  transaction: Transaction;
}