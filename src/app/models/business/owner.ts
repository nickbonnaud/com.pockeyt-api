import { Address } from './address';
export class Owner {
  identifier: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
  address: Address;
  primary: boolean;
  percentOwnership: number;
}
