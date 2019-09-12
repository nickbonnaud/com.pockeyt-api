import { AuthService } from './../services/auth.service';
import { Token } from './../models/business/token';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: Token = this.auth.getToken();

    if (token != null) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer: ${token}`)
      });
    }
    return next.handle(req);
  }
}
