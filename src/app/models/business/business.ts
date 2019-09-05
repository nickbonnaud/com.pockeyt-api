import { PosAccount } from './pos-account';
import { Location } from './location';
import { Accounts } from './accounts';
import { Profile } from './profile';
import { Photos } from './photos';

export class Business {
  identifier: string;
  email: string;
  token: string;
  profile: Profile;
  photos: Photos;
  accounts: Accounts;
  location: Location;
  posAccount: PosAccount;
}
