import { PosAccount } from './../../models/business/pos-account';
import { Location } from './../../models/business/location';
import { Coords } from './../../models/business/coords';
import { Bank } from './../../models/business/bank';
import { BusinessAccount } from './../../models/business/business-account';
import { Photos } from './../../models/business/photos';
import { BusinessService } from './../../services/business.service';
import { Profile } from './../../models/business/profile';
import { ApiService } from './../../services/api.service';
import { FormControlProviderService } from './../../forms/services/form-control-provider.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Owner } from 'src/app/models/business/owner';
import { urls } from 'src/app/urls/main';
import { Subject, Observable, forkJoin } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-on-board',
  templateUrl: './on-board.component.html',
  styleUrls: ['./on-board.component.scss']
})
export class OnBoardComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  profileForm: FormGroup;
  businessForm: FormGroup;
  ownerForm: FormGroup;
  bankForm: FormGroup;
  photosForm: FormGroup;
  mapForm: FormGroup;
  posForm: FormGroup;

  owners: Owner[] = [];
  currentStep: string;

  constructor(
    private fcProvider: FormControlProviderService,
    private api: ApiService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    this.profileForm = this.fcProvider.registerProfileControls();
    this.businessForm = this.fcProvider.registerBusinessControls();
    this.ownerForm = this.fcProvider.registerOwnerControls(this.owners);
    this.bankForm = this.fcProvider.registerBankControls();
    this.photosForm = this.fcProvider.registerPhotosControls();
    this.mapForm = this.fcProvider.registerMapControls();
    this.posForm = this.fcProvider.registerPosTypeControls();

    this.currentStep = 'profile';
  }

  goToPhotos(): void {
    this.currentStep = 'photos';
  }

  goToBusiness() {
    this.currentStep = 'business';
  }

  goToOwner(): void {
    this.currentStep = 'owner';
  }

  goToProfile(): void {
    this.currentStep = 'profile';
  }

  goToBank(): void {
    this.currentStep = 'bank';
  }

  goToMap(): void {
    this.currentStep = 'map';
  }

  goToPos(): void {
    this.currentStep = 'pos';
  }

  changeOwners(owners: Owner[]): void {
    this.owners = owners;
  }

  finishOnboard(): void {
    forkJoin([
      this.storeProfile(),
      this.storeBusinessData(),
      this.storeGeoData(),
      this.storePosData()
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: [Profile, [BusinessAccount, Owner[], Bank], Location, PosAccount]) => {
        this.businessService.updateProfile(data[0]);
        this.businessService.updateAccounts(data[1][0], data[1][1], data[1][2]);
        this.businessService.updateLocation(data[2]);
        this.businessService.updatePosAccount(data[3]);
        this.submitPhotos(data[0])
          .pipe(takeUntil(this.destroyed$))
          .subscribe((logoBannerPhotos: [Photos, Photos]) => {
            this.updatePhotos(logoBannerPhotos);
            console.log(this.businessService.business$.getValue());
          });
      });
  }

  storeBusinessData(): Observable<[BusinessAccount, Owner[], Bank]> {
    return forkJoin([this.postBusinessAccount(), this.postOwners(), this.postBank()]);
  }

  storePosData(): Observable<PosAccount> {
    return this.api.post<PosAccount>(urls.business.pos_store_patch, this.posForm.value);
  }

  storeGeoData(): Observable<Location> {
    return this.api.post<Location>(urls.business.location, this.mapForm.value);
  }

  postBank(): Observable<Bank> {
    return this.api.post<Bank>(urls.business.bank_store_patch, this.bankForm.value);
  }

  postOwners(): Observable<Owner[]> {
    let responses = [];

    this.owners.forEach((owner: Owner) => {
      responses.push(this.api.post<Owner>(urls.business.owner_store_patch, owner));
    });
    return forkJoin(responses);
  }

  postBusinessAccount(): Observable<BusinessAccount> {
    return this.api.post<BusinessAccount>(
      urls.business.account_store_patch,
      this.businessForm.value
    );
  }

  storeProfile(): Observable<Profile> {
    let profileData: Profile = this.profileForm.value;
    profileData.name = this.profileForm.get('name').value;
    return this.api.post<Profile>(urls.business.profile_store_get, profileData);
  }

  submitPhotos(profile: Profile): Observable<[Photos, Photos]> {
    let logoData = this.photosForm.get('logo').value;
    logoData['is_logo'] = true;

    let bannerData = this.photosForm.get('banner').value;
    bannerData['is_logo'] = false;

    return forkJoin([
      this.postPhoto(logoData, profile.identifier),
      this.postPhoto(bannerData, profile.identifier)
    ]);
  }

  postPhoto(data: any, profileId: string): Observable<Photos> {
    return this.api.post<Photos>(urls.business.photos_store, data, profileId);
  }

  updatePhotos(logoBannerPhotos: Photos[]) {
    let photos: Photos = new Photos();
    photos.logo = logoBannerPhotos[0].logo;
    photos.banner = logoBannerPhotos[1].banner;
    this.businessService.updatePhotos(photos);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
