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
    pos_store_patch_get: `${environment.base_url}/api/business/pos/account`,
    active_customers: `${environment.base_url}/api/business/customers/active`,
    transactions: `${environment.base_url}/api/business/transactions`,
    tips: `${environment.base_url}/api/business/tips`,
    employees: `${environment.base_url}/api/business/employees`
  },

  oauth: {
    square: `https://connect.squareup.com/oauth2/authorize?client_id=${environment.square_client_id}&scope=CUSTOMERS_READ CUSTOMERS_WRITE ITEMS_READ ORDERS_READ ORDERS_WRITE PAYMENTS_READ EMPLOYEES_READ`,
  },

  query: {
    recent_transaction: 'recent=true',
    employee_transaction: 'employee=',
    date_transaction: 'date[]=',
    status_transaction: 'status=',
    customer_transaction: 'customer=',
    sum_transaction_net_sales: 'sum=net_sales',
    sum_transaction_tax: 'sum=tax',
    sum_transaction_total: 'sum=total',
    sum_transaction_tip: 'sum=tip',
    employees_tips: 'employees=all',

    id: 'id='
  }
};
