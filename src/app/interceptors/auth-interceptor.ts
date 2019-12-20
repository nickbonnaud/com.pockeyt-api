import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Injectable({
  providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService) {}

  token: NbAuthJWTToken;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.token = token;
    });

    if (this.token != undefined) {
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer: ${this.token.getValue()}`)
      });
    }
    return next.handle(req);
  }
}
