import { environment } from './../../environments/environment';

export const urls = {
  auth: {
    register: `${environment.base_url}/api/business/auth/register`,
    login: `${environment.base_url}/api/business/auth/login`,
    logout: `${environment.base_url}/api/business/auth/logout`
  },

  business: {
    profile_store_get: `${environment.base_url}/api/business/profile`,
    photos_store: `${environment.base_url}/api/business/photos`,
    account_store_patch: `${environment.base_url}/api/business/payfac/business`,
    owner_store_patch: `${environment.base_url}/api/business/payfac/owner`,
    bank_store_patch: `${environment.base_url}/api/business/payfac/bank`,
    location: `${environment.base_url}/api/business/location/geo`,
    pos_store_patch: `${environment.base_url}/api/business/pos/account`
  }
};
