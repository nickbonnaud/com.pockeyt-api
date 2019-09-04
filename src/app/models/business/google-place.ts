export class GooglePlace {
  name: string;
  streetNumber: string;
  road: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  placeId: string;
  lat: string;
  lng: string;

  constructor(googleResponse: any) {
    this.name = googleResponse.name;
    this.website = googleResponse.website;
    this.placeId = googleResponse.place_id;
    this.phone = googleResponse.formatted_phone_number;
    this.setAddress(googleResponse.address_components);

    this.lat = googleResponse.geometry.location.lat();
    this.lng = googleResponse.geometry.location.lng();
  }

  setAddress(addressComponents: any[]) {
    addressComponents.forEach(component => {
      if (component.types.includes('street_number')) {
        this.streetNumber = component.long_name;
      } else if (component.types.includes('route')) {
        this.road = component.short_name;
      } else if (component.types.includes('locality')) {
        this.city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        this.state = component.short_name;
      } else if (component.types.includes('postal_code')) {
        this.zip = component.short_name;
      }
    });
  }
}
