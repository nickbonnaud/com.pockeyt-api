import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapKeys, snakeCase, camelCase } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BodyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isFormData: boolean = req.body instanceof FormData;
    if (req.body != undefined && !isFormData) {
      const snakeCaseObject = mapKeys(req.body, (v, k) => snakeCase(k));
      req = req.clone({ body: snakeCaseObject });
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body: object = this.toCamelCase(event.body);
          return event.clone({ body: body });
        }
      })
    );
  }

  toCamelCase(o: object): object {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
      return o.map(value => {
        if (typeof value === 'object') {
          value = this.toCamelCase(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = camelCase(origKey);
          value = o[origKey];
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.toCamelCase(value);
          }
          newO[newKey] = value;
        }
      }
    }
    return newO;
  }
}
