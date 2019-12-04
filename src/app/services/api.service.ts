import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class ApiService {
  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, body: T, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    return this.http.post<T>(endpoint, body);
  }

  patch<T>(endpoint: string, body: T, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    console.log(endpoint);
    return this.http.patch<T>(endpoint, body);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint);
  }

  delete<T>(endpoint: string, body: T, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    return this.http.delete<T>(endpoint, body);
  }
}
