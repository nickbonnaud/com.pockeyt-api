import { MockInterceptor } from './mock-interceptor';
import { FormInterceptor } from './form-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';

export const HttpInterceptorProviders = [
         { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
         { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
         { provide: HTTP_INTERCEPTORS, useClass: FormInterceptor, multi: true }
       ];
