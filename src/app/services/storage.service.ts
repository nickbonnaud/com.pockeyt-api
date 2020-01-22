import { Injectable } from '@angular/core';
import { Business } from '../models/business/business';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageName: string = "business_data";

  set(business: Business): void {
    localStorage.setItem(this.storageName, JSON.stringify(business));
  }

  get(): Business {
    const businessData = localStorage.getItem(this.storageName);
    return JSON.parse(businessData);
  }

  clear(): void {
    localStorage.removeItem(this.storageName);
  }

  destroy(): void {
    localStorage.clear();
  }
}
