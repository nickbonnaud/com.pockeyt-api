import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { urls } from '../urls/main';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService) {}

  token: string;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.token = token.getValue();
    });

    if (
      req.url == `${environment.base_url}/${urls.auth.login}` ||
      req.url == `${environment.base_url}/${urls.auth.register}`
    ) {
      this.token = undefined;
      this.authService.logout('email');
    }

    if (this.token != undefined) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + this.token)
      });
    }

    if (!req.headers.has("Content-Type") && !req.headers.has("Accept")) {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json")
      });
    }

    return next.handle(req);
  }
}
