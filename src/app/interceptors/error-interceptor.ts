import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/internal/operators/catchError';
import { retry } from 'rxjs/internal/operators/retry';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { urls } from '../urls/main';

@Injectable({
  providedIn: "root"
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toaster: NbToastrService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        const errorMessage: string = this.setErrorMessage(error);
        if (
          !error.url.endsWith("/auth/login") &&
          !error.url.endsWith("/auth/register")
        ) {
          this.showError(error);
          this.checkAuth(error);
        } else {
          this.showAuthError(error);
        }
        return throwError(errorMessage);
      })
    );
  }

  setErrorMessage(error: HttpErrorResponse): string {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return errorMessage;
  }

  checkAuth(error: HttpErrorResponse): void {
    if (error.status == 401) {
      this.router.navigateByUrl("/auth/login");
    }
  }

  showAuthError(errorResponse: any): void {
    let messageShown: boolean = false;
    Object.keys(errorResponse.error.errors).forEach((k, i) => {
      let messages: string = "";
      errorResponse.error.errors[k].forEach(error => {
        messages = `${messages} ${error}`;
      });

      if (!messageShown && messages.trim() == "invalid_credentials") {
        messageShown = true;
        this.toaster.danger(
          "Please check your email and password.",
          "Invalid Email or Password!",
          {
            preventDuplicates: true,
            destroyByClick: true,
            hasIcon: true,
            icon: "alert-triangle",
            duration: 0
          }
        );
      }
    });
  }

  showError(errorResponse: any): void {
    Object.keys(errorResponse.error.errors).forEach((k, i) => {
      let messages: string = "";
      let title = `Oops! An error with the ${k} has occurred!`;
      errorResponse.error.errors[k].forEach(error => {
        messages = `${messages} ${error}`;
      });

      this.toaster.danger(messages.trim(), title, {
        preventDuplicates: true,
        destroyByClick: true,
        hasIcon: true,
        icon: "alert-triangle",
        duration: 0
      });
    });
  }
}
