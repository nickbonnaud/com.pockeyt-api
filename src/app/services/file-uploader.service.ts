import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: "root"
})
export class FileUploaderService {
  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, body: any, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    return this.http.post<T>(endpoint, body, {
      headers: { Accept: "application/json" }
    });
  }

  patch<T>(endpoint: string, body: any, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    return this.http.patch<T>(endpoint, body, {
      headers: { Accept: "application/json" }
    });
  }
}
