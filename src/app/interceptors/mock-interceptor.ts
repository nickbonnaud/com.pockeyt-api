import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { urls } from '../urls/main';

const responses = [
  {
    url: urls.business.profile_store_get,
    body: 'Profile'
  },
  {
    url: urls.business.photos_store,
    body: 'Photos'
  },
  {
    url: urls.business.account_store_patch,
    body: 'Account'
  },
  {
    url: urls.business.owner_store_patch,
    body: 'Owner'
  },
  {
    url: urls.business.bank_store_patch,
    body: 'Bank'
  },
  {
    url: urls.business.location,
    body: 'Location'
  },
  {
    url: urls.business.pos_store_patch_get,
    body: 'Pos'
  },
  {
    url: urls.business.transactions,
    body: 'TransactionsOne'
  },
  {
    url: `${urls.business.transactions}?page=2`,
    body: 'TransactionsTwo'
  },
  {
    url: `${urls.business.transactions}?sum=net_sales`,
    body: 'SumSale'
  },
  {
    url: `${urls.business.transactions}?sum=tip`,
    body: 'SumSale'
  },
  {
    url: `${urls.business.transactions}?sum=tax`,
    body: 'SumSale'
  },
  {
    url: `${urls.business.transactions}?sum=total`,
    body: 'SumSale'
  },
  {
    url: `${urls.business.transactions}?id=success`,
    body: 'TransactionIdSuccess'
  },
  {
    url: `${urls.business.transactions}?id=fail`,
    body: 'TransactionIdFail'
  },
  {
    url: `${urls.business.tips}?employees=all`,
    body: 'EmployeeTips'
  },
  {
    url: urls.business.employees,
    body: 'Employees'
  },
  {
    url: `${urls.business.customers}?status=active`,
    body: 'ActiveCustomersOne'
  },
  {
    url: `${urls.business.customers}?status=active&page=2`,
    body: 'ActiveCustomersTwo'
  },
  {
    url: `${urls.business.customers}?status=historic`,
    body: 'HistoricCustomers'
  },
  {
    url: urls.business.transaction_status,
    body: 'TransactionStatuses'
  }
];

const externalUrls: string[] = ['https://maps.googleapis.com'];

@Injectable({
  providedIn: "root"
})
export class MockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.production && this.notExternalUrl(req)) {
      return of(this.mockResponse(req));
    } else {
      return next.handle(req);
    }
  }

  private notExternalUrl(req: HttpRequest<any>): boolean {
    let notExternalUrl = true;
    externalUrls.forEach(url => {
      if (req.url.startsWith(url)) {
        notExternalUrl = false;
      }
    });
    return notExternalUrl;
  }

  private mockResponse(req: HttpRequest<any>): HttpResponse<any> {
    let newReq: HttpResponse<any>;
    responses.forEach(response => {
      let reqUrl: string = req.url;
      if (reqUrl.indexOf('&date') >= 0) {
        reqUrl = reqUrl.substring(0, reqUrl.indexOf('&date'));
      }
      if (reqUrl.indexOf('?id=') >= 0) {
        const type = reqUrl.substring(reqUrl.indexOf('?id=') + 1);
        const suffix = type.endsWith('error') ? 'fail' : 'success';
        reqUrl = reqUrl.substring(0, reqUrl.indexOf('?id='));
        reqUrl = reqUrl + '?id=' + suffix;
      }
      if (response.url == reqUrl) {
        const reqMet = req.method.toLowerCase() + response.body;
        newReq = new HttpResponse({ status: 200, body: this[reqMet](req) });
      }
      if (response.url == reqUrl.substring(0, reqUrl.indexOf('?'))) {
        const reqMet = req.method.toLowerCase() + response.body;
        newReq = new HttpResponse({ status: 200, body: this[reqMet](req) });
      }
    });
    return newReq;
  }

  private postProfile(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier' };
  }

  private patchProfile(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier' };
  }

  getProfile(req: HttpRequest<any> = null) {
    return {
      data: {
        identifier: "6dd53fa0-0cbb-11ea-8e78-a377c0aba722",
        name: "Dickens PLC",
        website: "reilly.info",
        description: "Itaque nulla et itaque libero sed. Vero est et et expedita sapiente. Architecto officia nesciunt placeat molestiae et.",
        google_place_id: 'fekncdacdacd'
      }
    }
  }

  private postPhotos(req: HttpRequest<any>) {
    if (req.body.is_logo) {
      return {
        logo: {
          name: req.body.name,
          small_url: 'assets/images/mock/download.jpg',
          large_url: 'assets/images/mock/download.jpg'
        },
        banner: {}
      };
    } else {
      return {
        logo: {},
        banner: {
          name: req.body.name,
          small_url: 'assets/images/mock/banana.png',
          large_url: 'assets/images/mock/banana.png'
        }
      };
    }
  }

  getPhotos(req: HttpRequest<any> = null) {
    return {
      logo: {
        name: req == undefined ? "logo_name" : req.body.name,
        small_url: "assets/images/mock/download.jpg",
        large_url: "assets/images/mock/download.jpg"
      },
      banner: {
        name: req == undefined ? "banner_name" : req.body.name,
        small_url: "assets/images/mock/banana.png",
        large_url: "assets/images/mock/banana.png"
      }
    };
  }

  private postBank(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier' };
  }

  getBank(req: HttpRequest<any> = null) {
    return {
      data: {
        identifier: "c22ad580-1548-11ea-90e8-7168d105351c",
        address: {
          address: "656 Considine Manors",
          address_secondary: null,
          city: "Lake Joaquinborough",
          state: "NY",
          zip: "87097",
        },
        first_name: "Jean",
        last_name: "Pierre",
        routing_number: "XXXXX8614",
        account_number: "XXXXX0806",
        type: "savings",
      }
    }
  }

  private patchBank(req: HttpRequest<any>) {
    return {
      data: {
        identifier: 'fake_identifier',
        address: {
          address: req.body.address,
          address_secondary: null,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip
        },
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        routing_number: req.body.routing_number,
        account_number: req.body.account_number,
        type: req.body.type
      }
    }
  }

  private postAccount(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier' };
  }

  private patchAccount(req: HttpRequest<any>) {
    return { ...req.body };
  }

  getAccount(req: HttpRequest<any> = null) {
    return {
      data: {
        identifier: "f8b717c0-1041-11ea-8b65-7d41af110d21",
        ein: "38-6208188",
        business_name: "Gutkowski Group",
        address: {
          address: "261 Gust Station",
          address_secondary: "",
          city: "gardnerville",
          state: "WA",
          zip: "53366",
        },
        entity_type: "soleProprietorship"
      }
    }
  }

  private postOwner(req: HttpRequest<any>) {
    return {
      identifier: "fake_id",
      address: {
        address: req.body.address,
        address_secondary: null,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      },
      dob: req.body.dob,
      ssn: req.body.ssn,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      title: req.body.title,
      phone: req.body.phone,
      email: req.body.email,
      primary: req.body.primary,
      percent_ownership: req.body.percent_ownership
    };
  }

  private deleteOwner(req: HttpRequest<any>){
    return {
      success: true
    }
  }

  private patchOwner(req: HttpRequest<any>) {
    return {
      identifier: req.body.identifier,
      address: {
        address: req.body.address,
        address_secondary: null,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      },
      dob: req.body.dob,
      ssn: req.body.ssn,
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      title: req.body.title,
      phone: req.body.phone,
      email: req.body.email,
      primary: req.body.primary,
      percent_ownership: req.body.percent_ownership
    };
  }

  getOwner(req: HttpRequest<any> = null) {
    return {
      data: [
        {
          identifier: "df8de560-1073-11ea-80a1-93b22131cec1",
          address: {
            address: "93469 Breitenberg Gardens Suite 047",
            address_secondary: null,
            city: "Flossieshire",
            state: "VT",
            zip: "86069"
          },
          dob: "03/30/1977",
          ssn: "XXXXX3426",
          last_name: "Romaguera",
          first_name: "Camryn",
          title: "CEO",
          phone: "9507856208",
          email: "mable74@hills.info",
          primary: false,
          percent_ownership: 25
        },
        {
          identifier: "e0463b50-1073-11ea-886b-a9ffe5da05b2",
          address: {
            address: "307 Bauch Corner Apt. 689",
            address_secondary: null,
            city: "South Vergiebury",
            state: "MT",
            zip: "44550"
          },
          dob: "04/12/2014",
          ssn: "XXXXX4614",
          last_name: "Runolfsson",
          first_name: "Trycia",
          title: "CEO",
          phone: "5364477871",
          email: "erica.nikolaus@yahoo.com",
          primary: true,
          percent_ownership: 25
        }
      ]
    };
  }

  private postLocation(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier' };
  }

  getLocation(req: HttpRequest<any> = null) {
    return {
      data: {
        identifier: "45e29f80-15fa-11ea-af40-a548ae86dffa",
        lat: 35.925712,
        lng: -79.037973,
        radius: 75
      }
    };
  }

  private patchLocation(req: HttpRequest<any>) {
    return {
      data: {
        identifier: "45e29f80-15fa-11ea-af40-a548ae86dffa",
        lat: req.body.lat,
        lng: req.body.lng,
        radius: req.body.radius
      }
    };
  }

  private postPos(req: HttpRequest<any>) {
    return { ...req.body, identifier: 'fake_identifier', status: 'pending' };
  }

  private getPos(req: HttpRequest<any>) {
    return {
      identifier: '1f1beda0-da45-11e9-bb04-99c1aceb43be',
      type: 'square',
      takes_tips: true,
      allows_open_tickets: false,
      status: 'fail_webhook'
    };
  }

  private getHistoricCustomers(req: HttpRequest<any>) {
    return {
      data: [
        {
          customer: {
            identifier: '7369a320-de38-11e9-b813-a7431fdda378',
            email: 'lizzie.walker@example.org',
            first_name: 'Freeman',
            last_name: 'Ruecker',
            photo: {
              name: 'logo-1569266964SWUAB.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '73d1cc60-de38-11e9-9b75-0b3f966648ce',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'open',
            purchased_items: [
              {
                name: 'ullam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'quia',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'et',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'sed',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: [
              {
                total: '2035',
                created_at: '2019-09-23 19:29:25',
                updated_at: '2019-09-23 19:29:25'
              }
            ]
          },
          notification: null,
          entered_at: '2019-09-25T12:15:55.000000Z'
        },
        {
          customer: {
            identifier: '73dad080-de38-11e9-82b0-1fdf7bcf0a5c',
            email: 'bria35@example.org',
            first_name: 'Herman',
            last_name: 'Beahan',
            photo: {
              name: 'logo-1569266965l7H8T.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:14:55.000000Z'
        },
        {
          customer: {
            identifier: '73db4cd0-de38-11e9-a3ed-8f318ffbc496',
            email: 'zschmitt@example.org',
            first_name: 'Sigmund',
            last_name: 'Mitchell',
            photo: {
              name: 'logo-1569266965Ab7Du.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:13:55.000000Z'
        },
        {
          customer: {
            identifier: '73dbbbe0-de38-11e9-a2ad-514b7a235c2f',
            email: 'jana.mraz@example.org',
            first_name: 'Josefa',
            last_name: 'Kuvalis',
            photo: {
              name: 'logo-1569266965kBxNw.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:12:55.000000Z'
        },
        {
          customer: {
            identifier: '73dc27d0-de38-11e9-a856-a74a02bf5db7',
            email: 'myrtie42@example.net',
            first_name: 'Zelda',
            last_name: 'Stark',
            photo: {
              name: 'logo-1569266965Q7G26.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '73e8ae10-de38-11e9-89a0-4d1f466d5015',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'closed',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ipsam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'voluptatem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          },
          notification: null,
          entered_at: '2019-09-25T12:11:55.000000Z'
        }
      ],
      links: {
        first: `${urls.business.customers}?status=historic&page=1`,
        last: `${urls.business.customers}?status=historic&page=1`,
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: urls.business.customers,
        per_page: 5,
        to: 5,
        total: 5
      }
    };
  }

  private getActiveCustomersOne(req: HttpRequest<any>) {
    return {
      data: [
        {
          customer: {
            identifier: '7369a320-de38-11e9-b813-a7431fdda378',
            email: 'lizzie.walker@example.org',
            first_name: 'Freeman',
            last_name: 'Ruecker',
            photo: {
              name: 'logo-1569266964SWUAB.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '73d1cc60-de38-11e9-9b75-0b3f966648ce',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'open',
            purchased_items: [
              {
                name: 'ullam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'quia',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'et',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'sed',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: [
              {
                total: '2035',
                created_at: '2019-09-23 19:29:25',
                updated_at: '2019-09-23 19:29:25'
              }
            ]
          },
          notification: null,
          entered_at: '2019-09-25T12:15:55.000000Z'
        },
        {
          customer: {
            identifier: '73dad080-de38-11e9-82b0-1fdf7bcf0a5c',
            email: 'bria35@example.org',
            first_name: 'Herman',
            last_name: 'Beahan',
            photo: {
              name: 'logo-1569266965l7H8T.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:14:55.000000Z'
        },
        {
          customer: {
            identifier: '73db4cd0-de38-11e9-a3ed-8f318ffbc496',
            email: 'zschmitt@example.org',
            first_name: 'Sigmund',
            last_name: 'Mitchell',
            photo: {
              name: 'logo-1569266965Ab7Du.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:13:55.000000Z'
        },
        {
          customer: {
            identifier: '73dbbbe0-de38-11e9-a2ad-514b7a235c2f',
            email: 'jana.mraz@example.org',
            first_name: 'Josefa',
            last_name: 'Kuvalis',
            photo: {
              name: 'logo-1569266965kBxNw.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:12:55.000000Z'
        },
        {
          customer: {
            identifier: '73dc27d0-de38-11e9-a856-a74a02bf5db7',
            email: 'myrtie42@example.net',
            first_name: 'Zelda',
            last_name: 'Stark',
            photo: {
              name: 'logo-1569266965Q7G26.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '73e8ae10-de38-11e9-89a0-4d1f466d5015',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'closed',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ipsam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'voluptatem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          },
          notification: null,
          entered_at: '2019-09-25T12:11:55.000000Z'
        }
      ],
      links: {
        first: `${urls.business.customers}?status=active&page=1`,
        last: `${urls.business.customers}?status=active&page=2`,
        prev: null,
        next: `${urls.business.customers}?status=active&page=2`
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        path: urls.business.customers,
        per_page: 5,
        to: 5,
        total: 10
      }
    };
  }

  private getActiveCustomersTwo(req: HttpRequest<any>) {
    return {
      data: [
        {
          customer: {
            identifier: '73ea6e30-de38-11e9-a04c-714da744cb61',
            email: 'marisa.ortiz@example.org',
            first_name: 'Candice',
            last_name: 'Predovic',
            photo: {
              name: 'logo-1569266965gXceE.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '73f81940-de38-11e9-bd6c-91df7c7e1aef',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'paid',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'enim',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'vel',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: [
              {
                total: '2035',
                created_at: '2019-09-23 19:29:25',
                updated_at: '2019-09-23 19:29:25'
              }
            ]
          },
          notification: null,
          entered_at: '2019-09-25T12:10:55.000000Z'
        },
        {
          customer: {
            identifier: '73f9e730-de38-11e9-a78b-1742d6f58e1f',
            email: 'rasheed18@example.com',
            first_name: 'Demarcus',
            last_name: 'Langworth',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:17:55.000000Z'
        },
        {
          customer: {
            identifier: '73fa5a00-de38-11e9-905b-e531a83f2bcf',
            email: 'pvon@example.org',
            first_name: 'Kaylee',
            last_name: 'Kshlerin',
            photo: {
              name: 'logo-1569266965hukYk.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:18:55.000000Z'
        },
        {
          customer: {
            identifier: '73fac780-de38-11e9-aeb2-fb17cc53400f',
            email: 'ldietrich@example.com',
            first_name: 'Micaela',
            last_name: 'Kozey',
            photo: {
              name: 'logo-1569266965s3mMC.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: '74073240-de38-11e9-b3d2-33021e914163',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-09-23 19:29:25',
            updated_at: '2019-09-23 19:29:25',
            status: 'closed',
            purchased_items: [
              { name: 'est', sub_name: null, price: '2000' },
              {
                name: 'explicabo',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'beatae',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'autem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: [
              {
                total: '2035',
                created_at: '2019-09-23 19:29:25',
                updated_at: '2019-09-23 19:29:25'
              }
            ]
          },
          notification: null,
          entered_at: '2019-09-25T12:19:55.000000Z'
        },
        {
          customer: {
            identifier: '74090660-de38-11e9-9316-75a3889c0df7',
            email: 'bosco.rahsaan@example.org',
            first_name: 'Haylie',
            last_name: 'Rogahn',
            photo: {
              name: 'logo-1569266965EsSzY.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:20:55.000000Z'
        }
      ],
      links: {
        first: `${urls.business.customers}?status=active&page=1`,
        last: `${urls.business.customers}?status=active&page=2`,
        prev: `${urls.business.customers}?status=active&page=1`,
        next: null
      },
      meta: {
        current_page: 2,
        from: 6,
        last_page: 2,
        path: urls.business.customers,
        per_page: 5,
        to: 10,
        total: 10
      }
    };
  }

  private getTransactionsOne(req: HttpRequest<any>) {
    const test = {
      data: [
        {
          customer: {
            identifier: 'ac53b510-e482-11e9-96d1-176ba01f247b',
            email: 'fherman@example.org',
            first_name: 'Delmer',
            last_name: 'Mohr',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd46908d0-e469-11e9-b27a-15117e9ad336',
            employee_id: null,
            tax: '35',
            tip: '100',
            net_sales: '2000',
            total: '2135',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'ullam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'quia',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'et',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'sed',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'acc4bc30-e482-11e9-9658-6fff62e7d23f',
            email: 'izabella.hills@example.org',
            first_name: 'Kristoffer',
            last_name: 'Kris',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4745970-e469-11e9-9eeb-7bd5387f58bd',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ipsam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'voluptatem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'acd10670-e482-11e9-b61f-6fb73aabf07e',
            email: 'fsauer@example.net',
            first_name: 'Polly',
            last_name: 'Koelpin',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd47fd0f0-e469-11e9-9e55-9bd3d35f2dae',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'enim',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'vel',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'acde8040-e482-11e9-936a-632f522e77b4',
            email: 'rossie.sipes@example.net',
            first_name: 'Reese',
            last_name: 'Roob',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd48b5c40-e469-11e9-b29a-3b2c1dc30d00',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'vel',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'acebb770-e482-11e9-9ef8-299fa784f893',
            email: 'blaze12@example.com',
            first_name: 'Lynn',
            last_name: 'Rippin',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4998fe0-e469-11e9-acb2-bde8fd3fce2a',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ipsam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'acfa50f0-e482-11e9-b85d-6fde92cc401a',
            email: 'wrosenbaum@example.com',
            first_name: 'Julius',
            last_name: 'Jast',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4a5c490-e469-11e9-8483-c50bcb522574',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'ad08ef20-e482-11e9-94f2-ffecb6778bcb',
            email: 'alec.bruen@example.net',
            first_name: 'Dianna',
            last_name: 'Lesch',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4b42660-e469-11e9-9b75-4303ef10a25f',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'ullam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'sed',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'ad1637c0-e482-11e9-b9ba-9b5e984cc543',
            email: 'jamil.bogisich@example.com',
            first_name: 'Robyn',
            last_name: 'Harber',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4c23080-e469-11e9-b296-59329a5f55ad',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'ullam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'et',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'sed',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'ad24cd90-e482-11e9-ab9e-e7063c330b8a',
            email: 'cward@example.com',
            first_name: 'Mohammad',
            last_name: 'Kohler',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4d02570-e469-11e9-976b-8d8e6f962582',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'pariatur',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'voluptatem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: 'ad339fe0-e482-11e9-a138-c7ecae01452a',
            email: 'parker.monica@example.com',
            first_name: 'Kacey',
            last_name: 'Effertz',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4dec060-e469-11e9-bed2-432143b46a71',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'voluptatem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        }
      ],
      links: {
        first: req.urlWithParams.includes('?') ?  `${req.urlWithParams}&page=1` : `${req.urlWithParams}?page=1`,
        last: req.urlWithParams.includes('?') ?  `${req.urlWithParams}&page=2` : `${req.urlWithParams}?page=2`,
        prev: null,
        next: null,
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        path: urls.business.transactions,
        per_page: 10,
        to: 10,
        total: 15
      }
    };
    return test;
  }

  private getTransactionsTwo(req: HttpRequest<any>) {
    return {
      data: [
        {
          customer: {
            identifier: '8e181f10-e486-11e9-846a-a302f225170d',
            email: 'west.clotilde@example.org',
            first_name: 'Delaney',
            last_name: 'Windler',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd46908d0-e469-11e9-b27a-15117e9ad336',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: '8e25e930-e486-11e9-a8d8-b1306b5409c7',
            email: 'turner.saul@example.org',
            first_name: 'Shania',
            last_name: 'Braun',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4745970-e469-11e9-9eeb-7bd5387f58bd',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'enim',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: '8e31f360-e486-11e9-965c-4f18ec8e20a2',
            email: 'filomena.dickinson@example.com',
            first_name: 'Margie',
            last_name: 'Reynolds',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd47fd0f0-e469-11e9-9e55-9bd3d35f2dae',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:37:59',
            updated_at: '2019-10-01 16:37:59',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'enim',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: '8e403990-e486-11e9-b703-13cf4cd5dd70',
            email: 'ellen29@example.com',
            first_name: 'Julien',
            last_name: 'Stamm',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd48b5c40-e469-11e9-b29a-3b2c1dc30d00',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'enim',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'ut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'vel',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        },
        {
          customer: {
            identifier: '8e4f72d0-e486-11e9-8c47-8564aac754c6',
            email: 'purdy.ophelia@example.org',
            first_name: 'Kariane',
            last_name: 'Brown',
            photo: {
              name: 'logo-1569266965lWUPu.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          transaction: {
            identifier: 'd4998fe0-e469-11e9-acb2-bde8fd3fce2a',
            employee_id: null,
            tax: '35',
            tip: '0',
            net_sales: '2000',
            total: '2035',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-01 16:38:00',
            updated_at: '2019-10-01 16:38:00',
            status: 'open',
            purchased_items: [
              {
                name: 'ipsam',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'libero',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          }
        }
      ],
      links: {
        first: req.urlWithParams.includes('?') ?  `${req.urlWithParams}&page=1` : `${req.urlWithParams}?page=1`,
        last: req.urlWithParams.includes('?') ?  `${req.urlWithParams}&page=2` : `${req.urlWithParams}?page=2`,
        prev: req.urlWithParams.includes('?') ?  `${req.urlWithParams}&page=1` : `${req.urlWithParams}?page=1`,
        next: null
      },
      meta: {
        current_page: 2,
        from: 11,
        last_page: 2,
        path: urls.business.transactions,
        per_page: 10,
        to: 15,
        total: 15
      }
    };
  }

  private getEmployeeTips(req: HttpRequest<any>) {
    return {
      data: [
        {
          first_name: 'Alford',
          last_name: 'Miller',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Silas',
          last_name: 'Ondricka',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Austyn',
          last_name: 'Schiller',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Gus',
          last_name: 'Wunsch',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Alexane',
          last_name: 'Kautzer',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Cassandre',
          last_name: 'Kutch',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Leanna',
          last_name: 'Gerhold',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Ramon',
          last_name: 'Cummings',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Alverta',
          last_name: 'Gorczany',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Saige',
          last_name: 'Rutherford',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Kelsie',
          last_name: 'Carter',
          tips: Math.random() * 10000
        },
        {
          first_name: 'Ward',
          last_name: 'Gulgowski',
          tips: Math.random() * 10000
        }
      ],
      links: {
        first: `${urls.business.tips}?employees=all&page=1`,
        last: `${urls.business.tips}?employees=all&page=1`,
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: urls.business.tips,
        per_page: 15,
        to: 12,
        total: 12
      }
    };
  }

  private getEmployees(req: HttpRequest<any>) {
    return {
      data: [
        {
          identifier: '1f6872c0-eedd-11e9-9198-afe1b3f15c1c',
          external_id: 'dce68af0-12c0-3508-8968-21ce356c10dc',
          first_name: 'Geraldine',
          last_name: 'Orn',
          email: null
        },
        {
          identifier: '1f688150-eedd-11e9-9404-f7d57ee74616',
          external_id: '721082ed-0ce3-38ae-a8e3-425f80dd40ca',
          first_name: 'Breana',
          last_name: 'Gusikowski',
          email: null
        },
        {
          identifier: '1f688b70-eedd-11e9-a828-add7bd6811a8',
          external_id: 'e449fbb2-b613-3714-94f7-2999a92083d1',
          first_name: 'Chadrick',
          last_name: 'Will',
          email: null
        },
        {
          identifier: '1f689520-eedd-11e9-9a06-e94ca5aaaaea',
          external_id: 'af8ad01e-6eb6-367e-9c41-1eee42734675',
          first_name: 'Estel',
          last_name: 'Corkery',
          email: null
        },
        {
          identifier: '1f68a0e0-eedd-11e9-8073-2937f2d8c8a9',
          external_id: 'd5c4f1a2-146a-3384-8c04-587a1d377f42',
          first_name: 'Ross',
          last_name: 'Roob',
          email: null
        },
        {
          identifier: '1f68aa60-eedd-11e9-b7b2-b14b393c426b',
          external_id: 'b986c5a7-e6ba-3833-8626-f8e30330b97d',
          first_name: 'Ruby',
          last_name: 'Eichmann',
          email: null
        },
        {
          identifier: '1f68b920-eedd-11e9-9d9f-759a4e938408',
          external_id: '68a1350f-9f0e-3e2f-98fc-d33434fcc50c',
          first_name: 'Lambert',
          last_name: 'Deckow',
          email: null
        },
        {
          identifier: '1f68c3b0-eedd-11e9-a519-3b60505c1c3c',
          external_id: 'f680f4f7-efde-3889-b7ca-627a4ced1de6',
          first_name: 'Remington',
          last_name: 'Hirthe',
          email: null
        },
        {
          identifier: '1f68cd40-eedd-11e9-873b-a9dcc2eea123',
          external_id: 'c5815d3d-e007-3975-bf6d-b6b29f373089',
          first_name: 'Naomie',
          last_name: 'Bahringer',
          email: null
        },
        {
          identifier: '1f68d6a0-eedd-11e9-87b8-bb2ce880c45c',
          external_id: 'c9a79ee1-d79f-3fde-ba3b-d5bc68b08b11',
          first_name: 'Garth',
          last_name: 'Fay',
          email: null
        },
        {
          identifier: '1f68dff0-eedd-11e9-987f-abd8677b1f08',
          external_id: '297892a7-7467-37a7-869c-37ee71c3d148',
          first_name: 'Dewayne',
          last_name: 'Runolfsson',
          email: null
        },
        {
          identifier: '1f68ec30-eedd-11e9-95fc-6ff96796eff5',
          external_id: '1959b7fb-16f6-379d-acd8-6668b869face',
          first_name: 'Tanya',
          last_name: 'Schimmel',
          email: null
        },
        {
          identifier: '1f68f580-eedd-11e9-9851-a3bcd8a5e37c',
          external_id: 'a3036443-5f97-3bcf-9b98-309d8617fe68',
          first_name: 'Roxanne',
          last_name: "O'Keefe",
          email: null
        }
      ],
      links: {
        first: `${urls.business.employees}?page=1`,
        last: `${urls.business.employees}?page=1`,
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: urls.business.employees,
        per_page: 15,
        to: 13,
        total: 13
      }
    };
  }

  private getTransactionIdSuccess(req: HttpRequest<any>) {
    return {
      data: [
        {
          transaction: {
            identifier: '14622780-f048-11e9-ae63-fbf53309594a',
            employee_id: '998b52f2-27b4-3747-9435-365ab9020f3c',
            tax: '122',
            tip: '297',
            net_sales: '1624',
            total: '2043',
            partial_payment: '0',
            locked: '1',
            bill_created_at: '2019-10-16 19:06:38',
            updated_at: '2019-10-16 19:06:38',
            status: 'open',
            purchased_items: [
              {
                name: 'quasi',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'aut',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'adipisci',
                sub_name: null,
                price: '2000'
              },
              {
                name: 'exercitationem',
                sub_name: null,
                price: '2000'
              }
            ],
            refunds: []
          },
          customer: {
            identifier: '14524450-f048-11e9-a8ce-8bb288bc53b4',
            email: 'ramona.stiedemann@example.net',
            first_name: 'Sid',
            last_name: 'Schmitt',
            photo: {
              name: 'logo-15712527985szGx.png',
              small_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`,
              large_url: `assets/images/mock/avatar-${this.randomNum(1, 6)}.png`
            }
          },
          employee: {
            identifier: '145193c0-f048-11e9-bbbe-67c55b5673f3',
            external_id: '998b52f2-27b4-3747-9435-365ab9020f3c',
            first_name: 'Naomi',
            last_name: 'Skiles',
            email: null
          }
        }
      ],
      links: {
        first: `${urls.business.transactions}?id=14622780-f048-11e9-ae63-fbf53309594a&page=1`,
        last: `${urls.business.transactions}?id=14622780-f048-11e9-ae63-fbf53309594a&page=1`,
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: urls.business.transactions,
        per_page: 10,
        to: 1,
        total: 1
      }
    };
  }

  private getTransactionIdFail(req: HttpRequest<any>) {
    return {
      data: [],
      links: {
        first: `${urls.business.transactions}?id=14622780-f048-11e9-ae63-fbf53309594a&page=1`,
        last: `${urls.business.transactions}?id=14622780-f048-11e9-ae63-fbf53309594a&page=1`,
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: null,
        last_page: 1,
        path: urls.business.transactions,
        per_page: 10,
        to: null,
        total: 0
      }
    };
  }

  private getTransactionStatuses(req: HttpRequest<any>) {
    return {
      data: [
        {
          name: "open",
          code: "100"
        },
        {
          name: "closed",
          code: "101"
        },
        {
          name: "notification pending",
          code: "102"
        },
        {
          name: "payment processing",
          code: "103"
        },
        {
          name: "paid",
          code: "200"
        },
        {
          name: "wrong bill assigned",
          code: "500"
        },
        {
          name: "error in bill",
          code: "501"
        },
        {
          name: "error notifying",
          code: "502"
        },
        {
          name: "other bill error",
          code: "503"
        }
      ]
    }
  }

  private getSumSale(req: HttpRequest<any>) {
    return {
      data: {
        sales_data: Math.random() * 10000
      }
    };
  }

  private randomNum(floor: number, ceiling: number): number {
    return Math.floor(Math.random() * ceiling) + floor;
  }
}
