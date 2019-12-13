import { Status } from '../other-data/status';

export class PosAccount {
  identifier: string;
  type: string;
  takesTips: boolean;
  allowsOpenTickets: boolean;
  status: Status;
}
