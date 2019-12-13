import { Bank } from './bank';
import { BusinessAccount } from './business-account';
import { Owner } from './owner';
import { Status } from '../other-data/status';

export class Accounts {
  businessAccount: BusinessAccount;
  ownerAccounts: Owner[];
  bankAccount: Bank;
  accountStatus: Status
}
