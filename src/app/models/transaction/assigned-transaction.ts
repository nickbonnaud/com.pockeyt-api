import { Employee } from './../employee/employee';
import { Transaction } from './transaction';
import { Customer } from './../customer/customer';

export class AssignedTransaction {
  transaction: Transaction;
  customer: Customer;
  employee: Employee;
}
