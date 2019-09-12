import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, body: T, resourceId?: string): Observable<T> {
    endpoint = resourceId != undefined ? `${endpoint}/${resourceId}` : endpoint;
    return this.http.post<T>(endpoint, body);
  }
}
