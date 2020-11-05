import { OpenHours } from './open-hours';

export class Profile {
  identifier: string;
  name: string;
  website: string;
  description: string;
  phone: string;
  googlePlaceId: string;
  hours: OpenHours;
}
