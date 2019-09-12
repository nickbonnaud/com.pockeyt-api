import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { urls } from '../urls/main';

const responses = [
  {
    url: urls.business.profile_store_get,
    body: 'profileStoreGet'
  },
  {
    url: urls.business.photos_store,
    body: 'storePhotos'
  },
  {
    url: urls.business.account_store_patch,
    body: 'storeAccount'
  },
  {
    url: urls.business.owner_store_patch,
    body: 'storeOwner'
  },
  {
    url: urls.business.bank_store_patch,
    body: 'storeBank'
  },
  {
    url: urls.business.location,
    body: 'storeLocation'
  },
  {
    url: urls.business.pos_store_patch,
    body: 'storePos'
  }
]

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.production) {
      return of(this.mockResponse(req));
    } else {
      next.handle(req);
    }
  }

  private mockResponse(req: HttpRequest<any>): HttpResponse<any> {
    let newReq: HttpResponse<any>;
    responses.forEach(response => {
      if (response.url == req.url) {
        newReq = new HttpResponse({ status: 200, body: this[response.body](req) });
      }
    });
    return newReq;
  }

  private profileStoreGet(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private storePhotos(req: HttpRequest<any>) {
    if (req.body.is_logo) {
      return {
        logo: {
          name: req.body.name,
          small_url: '/src/assets/images/mock/download.jpg',
          large_url: '/src/assets/images/mock/download.jpg'
        },
        banner: {}
      };
    } else {
      return {
        logo: {},
        banner: {
          name: req.body.name,
          small_url: '/src/assets/images/mock/banana.png',
          large_url: '/src/assets/images/mock/banana.png'
        }
      };
    }
  }

  private storeBank(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private storeAccount(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private storeOwner(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private storeLocation(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier' };
  }

  private storePos(req: HttpRequest<any>) {
    return { ...req.body, identifer: 'fake_identifier', status: 'pending' }
  }
}
