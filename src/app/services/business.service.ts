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
import { PosAccount } from '../models/business/pos-account';
import { Address } from '../models/business/address';
import { Owner } from '../models/business/owner';
import { environment } from 'src/environments/environment';
import { MockInterceptor } from '../interceptors/mock-interceptor';
import { BodyInterceptor } from '../interceptors/body-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  business$: BehaviorSubject<Business> = new BehaviorSubject<Business>(this.newBusiness());
  constructor(private mockData: MockInterceptor, private bodyMutator: BodyInterceptor) {
    if (!environment.production) {
      this.createTestBusiness();
    }
   }

   createTestBusiness(): void {
    this.updateBusiness(this.newBusiness());
    let profile: any = this.mockData.getProfile()["data"];
    profile = this.bodyMutator.toCamelCase(profile);
    this.updateProfile(profile);

    let photos: any = this.mockData.getPhotos()
    photos = this.bodyMutator.toCamelCase(photos);
    this.updatePhotos(photos);

    let businessAccount: any = this.mockData.getAccount()['data'];
    businessAccount = this.bodyMutator.toCamelCase(businessAccount);
    this.updateAccounts(businessAccount, [], new Bank());
   }

  updateBusiness(business: Business): void {
    this.business$.next(business);
  }

  newBusiness(): Business {
    let business: Business = new Business();
    business.profile = new Profile();
    business.photos = this.newPhotos();
    business.accounts = this.newAccounts();
    business.location = new Location();
    business.posAccount = new PosAccount();
    return business;
  }

  updateAccounts(businessAccount: BusinessAccount, owners: Owner[], bank: Bank): void {
    let accounts: Accounts = new Accounts();
    accounts.businessAccount = businessAccount;
    accounts.ownerAccounts = owners;
    accounts.bankAccount = bank;
    this.updateBusiness(Object.assign(this.business$.value, { accounts: accounts }));
  }

  updatePosAccount(posAccount: PosAccount): void {
    this.updateBusiness(Object.assign(this.business$.value, { posAccount: posAccount }));
  }

  updateProfile(profile: Profile): void {
    this.updateBusiness(Object.assign(this.business$.value, { profile: profile }));
  }

  updatePhotos(photos: Photos): void {
    this.updateBusiness(Object.assign(this.business$.value, { photos: photos}));
  }

  updateLocation(location: Location): void {
    this.updateBusiness(Object.assign(this.business$.value, { location: location }));
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
