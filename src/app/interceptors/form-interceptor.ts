import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mapKeys, snakeCase, camelCase } from 'lodash';

@Injectable()
export class FormInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const snakeCaseObject = mapKeys(req.body, (v, k) => snakeCase(k));
    const newReq = req.clone({body: snakeCaseObject})
    return next.handle(newReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const camelCaseObject = mapKeys(event.body, (v, k) => camelCase(k));
          const newEvent = event.clone({ body: camelCaseObject });
          return newEvent;
        }
      })
    );
  }
}
