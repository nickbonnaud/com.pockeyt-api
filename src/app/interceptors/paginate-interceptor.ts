import { PaginatePage } from './../models/other-data/paginate-page';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { PaginatorService } from '../services/paginator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';


@Injectable({
  providedIn: 'root'
})
export class PaginateInterceptor implements HttpInterceptor {
  constructor(private paginator: PaginatorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body: object = this.stripPaginateData(event.body);
          return event.clone({ body: body });
        }
      })
    );
  }

  stripPaginateData(body: object): object {
    if (body['data'] == undefined) { return body }
    this.updatePaginator(body);
    return body['data'];
  }

  updatePaginator(body: object): void {
    if (body['links'] == undefined || body['meta'] == undefined) {return}
    let page: PaginatePage = new PaginatePage();
    page.links = body['links'];
    page.meta = body['meta'];
    this.paginator.addPageData(page);
  }
}
