import { Address } from './address';
export class GooglePlace {
  name: string;
  address: Address;
  website: string;
  placeId: string;
  lat: string;
  lng: string;
  phone: string;

  constructor(googleResponse: any) {
    this.name = googleResponse.name;
    this.website = googleResponse.website;
    this.placeId = googleResponse.place_id;
    this.address = this.setAddress(googleResponse.address_components);
    this.lat = googleResponse.geometry.location.lat();
    this.lng = googleResponse.geometry.location.lng();
    this.phone = googleResponse.formatted_phone_number;
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
}
