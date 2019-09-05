import { Location } from './../models/business/location';
import { Accounts } from './../models/business/accounts';
import { Photos } from './../models/business/photos';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Business } from '../models/business/business';
import { Profile } from '../models/business/profile';
import { Photo } from '../models/business/photo';
import { BusinessAccount } from '../models/business/business-account';
import { Bank } from '../models/business/bank';
import { Coords } from '../models/business/coords';
import { Beacon } from '../models/business/beacon';
import { PosAccount } from '../models/business/pos-account';
import { Address } from '../models/business/address';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  business$: BehaviorSubject<Business> = new BehaviorSubject<Business>(this.newBusiness());

  constructor() { }

  updateBusiness(business: Business): void {
    this.business$.next(business);
  }

  newBusiness(): Business {
    let business: Business = new Business();
    business.profile = new Profile();
    business.photos = this.newPhotos();
    business.accounts = this.newAccounts();
    business.location = this.newLocation();
    business.posAccount = new PosAccount();
    return business;
  }

  private newLocation(): Location {
    let location: Location = new Location;
    location.coords = new Coords();
    location.beacon = new Beacon();
    return location;
  }

  private newAccounts(): Accounts {
    let accounts: Accounts = new Accounts();
    accounts.businessAccount = this.newBusinessAccount();
    accounts.ownerAccounts = [];
    accounts.bankAccount = new Bank();
    return accounts;
  }

  private newBusinessAccount(): BusinessAccount {
    let businessAccount: BusinessAccount = new BusinessAccount();
    businessAccount.address = new Address();
    return businessAccount;
  }

  private newPhotos(): Photos {
    let photos: Photos = new Photos();
    photos.logo = new Photo();
    photos.banner = new Photo();
    return photos;
  }
}
