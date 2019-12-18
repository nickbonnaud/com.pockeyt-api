import { MockInterceptor } from './mock-interceptor';
import { BodyInterceptor } from './body-Interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth-interceptor';
import { PaginateInterceptor } from './paginate-interceptor';
import { DelayInterceptor } from './delay-interceptor';

export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: BodyInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: PaginateInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DelayInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
];
