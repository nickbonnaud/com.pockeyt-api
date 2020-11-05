import { Address } from './address';
import { OpenHours } from './open-hours';
export class GooglePlace {
  name: string;
  address: Address;
  website: string;
  placeId: string;
  lat: string;
  lng: string;
  phone: string;
  hours: OpenHours;

  constructor(googleResponse: any) {
    this.name = googleResponse.name;
    this.website = googleResponse.website;
    this.placeId = googleResponse.place_id;
    this.address = this.setAddress(googleResponse.address_components);
    this.lat = googleResponse.geometry.location.lat();
    this.lng = googleResponse.geometry.location.lng();
    this.phone = googleResponse.formatted_phone_number;
    this.hours = this.setHours(googleResponse.opening_hours.weekday_text);
  }

  setAddress(addressComponents: any[]) {
    let address: Address = new Address();
    let streetNumber: string;
    let road: string;
    addressComponents.forEach(component => {
      if (component.types.includes('street_number')) {
        streetNumber = component.long_name;
      } else if (component.types.includes('route')) {
        road = component.short_name;
      } else if (component.types.includes('locality')) {
        address.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        address.state = component.short_name;
      } else if (component.types.includes('postal_code')) {
        address.zip = component.short_name;
      }
    });
    address.address = `${streetNumber} ${road}`;
    return address;
  }

  setHours(hours: any[]) {
    let openHours: OpenHours = new OpenHours();
    openHours.monday = hours[0];
    openHours.tuesday = hours[1];
    openHours.wednesday = hours[2];
    openHours.thursday = hours[3];
    openHours.friday = hours[4];
    openHours.saturday = hours[5];
    openHours.sunday = hours[6];
    return openHours;
  }
}
