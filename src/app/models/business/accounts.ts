import { Bank } from './bank';
import { BusinessAccount } from './business-account';
import { Owner } from './owner';

export class Accounts {
  businessAccount: BusinessAccount;
  ownerAccounts: Owner[];
  bankAccount: Bank;
}
