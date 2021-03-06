import { Location } from "./../models/business/location";
import { Accounts } from "./../models/business/accounts";
import { Photos } from "./../models/business/photos";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Business } from "../models/business/business";
import { Profile } from "../models/business/profile";
import { Photo } from "../models/business/photo";
import { BusinessAccount } from "../models/business/business-account";
import { Bank } from "../models/business/bank";
import { PosAccount } from "../models/business/pos-account";
import { Address } from "../models/business/address";
import { Owner } from "../models/business/owner";
import { environment } from "src/environments/environment";
import { MockInterceptor } from "../interceptors/mock-interceptor";
import { BodyInterceptor } from "../interceptors/body-Interceptor";
import { Status } from "../models/other-data/status";
import { StorageService } from './storage.service';

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  business$: BehaviorSubject<Business> = new BehaviorSubject<Business>(
    this.newBusiness()
  );

  constructor(
    private mockData: MockInterceptor,
    private bodyMutator: BodyInterceptor,
    private storageService: StorageService
  ) {
    if (!environment.production) {
      this.createTestBusiness();
    }
  }

  createTestBusiness(): void {
    let business: Business = this.newBusiness();
    business.email = "fake_email@gmail.com";
    business.identifier = "fake_id";
    this.updateBusiness(business);
    let profile: any = this.mockData.getProfile()["data"];
    profile = this.bodyMutator.toCamelCase(profile);
    this.updateProfile(profile);

    let photos: any = this.mockData.getPhotos()["data"];
    photos = this.bodyMutator.toCamelCase(photos);
    this.updatePhotos(photos);

    let businessAccount: any = this.mockData.getAccount()["data"];
    businessAccount = this.bodyMutator.toCamelCase(businessAccount);

    let businessOwners: any = this.mockData.getOwner()["data"];
    businessOwners = this.bodyMutator.toCamelCase(businessOwners);

    let bank: any = this.mockData.getBank()["data"];
    bank = this.bodyMutator.toCamelCase(bank);

    this.updateAccounts(businessAccount, businessOwners, bank);

    let location: any = this.mockData.getLocation()["data"];
    location = this.bodyMutator.toCamelCase(location);
    this.updateLocation(location);

    let posAccount: any = this.mockData.getPos();
    posAccount = this.bodyMutator.toCamelCase(posAccount);
    this.updatePosAccount(posAccount);

    let accountStatus: Status = {
      name: "Account Active",
      code: 106
    };

    this.updateAccountStatus(accountStatus);
  }

  updateBusiness(business: Business): void {
    business.profile = business.profile == undefined ? new Profile() : business.profile;
    business.accounts.businessAccount = business.accounts.businessAccount == undefined ? new BusinessAccount() : business.accounts.businessAccount;
    business.accounts.ownerAccounts = business.accounts.ownerAccounts == undefined ? [] : business.accounts.ownerAccounts;
    business.accounts.bankAccount = business.accounts.bankAccount == undefined ? new Bank() : business.accounts.bankAccount;
    business.location = business.location == undefined ? new Location() : business.location;
    business.posAccount = business.posAccount == undefined ? new PosAccount() : business.posAccount;
    if (business.photos == undefined) {
      business.photos = new Photos();
    }
    business.photos.logo = business.photos.logo == undefined ? new Photo() : business.photos.logo;
    business.photos.banner = business.photos.banner == undefined ? new Photo() : business.photos.banner;
    this.update(business);
  }

  private update(business: Business): void {
    this.storageService.set(business);
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

  updateAccounts(
    businessAccount: BusinessAccount,
    owners: Owner[],
    bank: Bank
  ): void {
    let accounts: Accounts = new Accounts();
    accounts.businessAccount = businessAccount;
    accounts.ownerAccounts = owners;
    accounts.bankAccount = bank;
    accounts.accountStatus = this.business$.value.accounts.accountStatus;
    this.updateBusiness(
      Object.assign(this.business$.value, { accounts: accounts })
    );
  }

  updateBusinessAccount(businessAccount: BusinessAccount): void {
    const business: Business = Object.assign({}, this.business$.value, {
      accounts: {
        ...this.business$.value.accounts,
        businessAccount: businessAccount
      }
    });
    this.updateBusiness(business);
  }

  updateAccountStatus(status: Status): void {
    let accounts: Accounts = this.business$.value.accounts;
    accounts.accountStatus = status;
    this.updateBusiness(
      Object.assign(this.business$.value, { accounts: accounts })
    );
  }

  updatePosAccount(posAccount: PosAccount): void {
    this.updateBusiness(
      Object.assign(this.business$.value, { posAccount: posAccount })
    );
  }

  updateProfile(profile: Profile): void {
    this.updateBusiness(
      Object.assign(this.business$.value, { profile: profile })
    );
  }

  updatePhotos(photos: Photos): void {
    this.updateBusiness(
      Object.assign(this.business$.value, { photos: photos })
    );
  }

  updateLocation(location: Location): void {
    this.updateBusiness(
      Object.assign(this.business$.value, { location: location })
    );
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
