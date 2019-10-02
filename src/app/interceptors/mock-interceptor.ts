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
    url: urls.business.active_customers,
    body: 'ActiveCustomersOne'
  },
  {
    url: `${urls.business.active_customers}?page=2`,
    body: 'ActiveCustomersTwo'
  },
  {
    url: `${urls.business.transactions}?type=recent`,
    body: 'TransactionsOne'
  },
  {
    url: `${urls.business.transactions}?type=recent&page=2`,
    body: 'TransactionsTwo'
  }
];

const externalUrls: string[] = ['https://maps.googleapis.com'];

@Injectable()
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
      if (response.url == req.url) {
        const reqMet = req.method.toLowerCase() + response.body;
        newReq = new HttpResponse({ status: 200, body: this[reqMet](req) });
      }
    });
    return newReq;
  }

  private postProfile(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
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

  private postBank(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private postAccount(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private postOwner(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private postLocation(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private postPos(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier', status: 'pending' };
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
            },
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
            },
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
            },
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
            },
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
            },
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
        first: `${urls.business.active_customers}?page=1`,
        last: `${urls.business.active_customers}?page=2`,
        prev: null,
        next: `${urls.business.active_customers}?page=2`
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        path: urls.business.active_customers,
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
            },
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
            },
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
            },
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
            },
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
            },
          },
          transaction: null,
          notification: null,
          entered_at: '2019-09-25T12:20:55.000000Z'
        }
      ],
      links: {
        first: `${urls.business.active_customers}?page=1`,
        last: `${urls.business.active_customers}?page=2`,
        prev: `${urls.business.active_customers}?page=1`,
        next: null
      },
      meta: {
        current_page: 2,
        from: 6,
        last_page: 2,
        path: urls.business.active_customers,
        per_page: 5,
        to: 10,
        total: 10
      }
    };
  }

  private getTransactionsOne(req: HttpRequest<any>) {
    return {
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
        first: `${urls.business.transactions}?type=recent&page=1`,
        last: `${urls.business.transactions}?type=recent&page=2`,
        prev: null,
        next: `${urls.business.transactions}?type=recent&page=2`
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
        first: `${urls.business.transactions}?type=recent&page=1`,
        last: `${urls.business.transactions}?type=recent&page=2`,
        prev: `${urls.business.transactions}?type=recent&page=1`,
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

  private randomNum(floor: number, ceiling: number): number {
    return Math.floor(Math.random() * ceiling) + floor;
  }
}
