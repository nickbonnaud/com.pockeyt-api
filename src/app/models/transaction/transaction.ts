import { PurchasedItem } from './purchased-item';
import { Refund } from './refund';

export class Transaction {
  identifier: string;
  employeeId: string;
  tax: number;
  tip: number;
  netSales: number;
  total: number;
  partialPayment: boolean;
  billCreatedAt: string;
  updatedAt: string;
  status: string;
  purchasedItems: PurchasedItem[];
  refund: Refund;
}
