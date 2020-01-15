import { PosAccount } from "./../../models/business/pos-account";
import { Location } from "./../../models/business/location";
import { Bank } from "./../../models/business/bank";
import { BusinessAccount } from "./../../models/business/business-account";
import { Photos } from "./../../models/business/photos";
import { BusinessService } from "./../../services/business.service";
import { Profile } from "./../../models/business/profile";
import { ApiService } from "./../../services/api.service";
import { FormControlProviderService } from "./../../forms/services/form-control-provider.service";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Owner } from "src/app/models/business/owner";
import { urls } from "src/app/urls/main";
import { Subject, Observable, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Business } from "src/app/models/business/business";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { NbAuthService, NbAuthJWTToken } from "@nebular/auth";
import { RouteFinderService } from "src/app/services/route-finder.service";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import { NbStepperComponent } from "@nebular/theme";
import { FileUploaderService } from 'src/app/services/file-uploader.service';

@Component({
  selector: "app-on-board",
  templateUrl: "./on-board.component.html",
  styleUrls: ["./on-board.component.scss"]
})
export class OnBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("oauthAlert", { static: false }) private oauthAlert: SwalComponent;
  @ViewChild("stepper", { static: false }) private stepper: NbStepperComponent;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  loading: boolean = false;

  profileForm: FormGroup;
  businessForm: FormGroup;
  ownerForm: FormGroup;
  bankForm: FormGroup;
  photosForm: FormGroup;
  mapForm: FormGroup;
  posForm: FormGroup;

  owners: Owner[] = [];
  currentStep: string;

  hiddenProfile: boolean = false;
  hiddenPhotos: boolean = false;
  hiddenBusinessAccount: boolean = false;
  hiddenOwner: boolean = false;
  hiddenBank: boolean = false;
  hiddenGeoData: boolean = false;
  hiddenPos: boolean = false;

  business: Business;
  initialProgress: number;

  constructor(
    private fcProvider: FormControlProviderService,
    private api: ApiService,
    private fileUploader: FileUploaderService,
    private businessService: BusinessService,
    private router: Router,
    private authService: NbAuthService,
    private routeFinderService: RouteFinderService
  ) {}

  ngOnInit() {
    this.profileForm = this.fcProvider.registerProfileControls();
    this.businessForm = this.fcProvider.registerBusinessControls();
    this.ownerForm = this.fcProvider.registerOwnerControls(this.owners);
    this.bankForm = this.fcProvider.registerBankControls();
    this.photosForm = this.fcProvider.registerPhotosControls();
    this.mapForm = this.fcProvider.registerMapControls();
    this.posForm = this.fcProvider.registerPosTypeControls();

    this.checkOnboardProgress();
  }

  ngAfterViewInit(): void {
    this.showWelcome();
  }

  showWelcome(): void {
    if (this.routeFinderService.getPreviousUrl() == "/auth/register") {
      this.oauthAlert.update({
        title: `Welcome to the ${environment.app_name} Dashboard!`,
        text: `Lets get started onboarding your business. You will be set up and ready to take ${environment.app_name} Pay in no time!`,
        type: "success",
        showConfirmButton: true
      });
      this.oauthAlert.fire();
    }
  }

  checkOnboardProgress(): void {
    this.business = this.businessService.business$.getValue();
    this.initialProgress = +this.business.accounts.accountStatus.code;
    switch (this.initialProgress) {
      case 100:
        this.currentStep = "profile";
        break;
      case 101:
        this.currentStep = "photos";
        break;
      case 102:
        this.currentStep = "business";
        break;
      case 103:
        this.currentStep = "owner";
        break;
      case 104:
        this.currentStep = "bank";
        break;
      case 105:
        this.currentStep = "map";
        break;
      case 106:
        this.currentStep = "pos";
        break;
      default:
        this.currentStep = "profile";
        break;
    }
  }

  storeProfile(): void {
    this.loading = true;
    const business: Business = this.businessService.business$.getValue();
    if (business.location.lat != undefined && business.location.lng != undefined) {
        forkJoin([
        this.postProfile(),
        this.postLocation(business)
      ])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((data: [Profile, Location]) => {
          this.business.profile = data[0];
          this.business.location = data[1];
          this.loading = false;
          this.goToPhotos();
        });
    } else {
      this.postProfile()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((profile: Profile) => {
          this.business.profile = profile;
          this.loading = false;
          this.goToPhotos();
        });
    }
  }

  postProfile(): Observable<Profile> {
    let profileData: Profile = this.profileForm.value;
    profileData.name = this.profileForm.get("name").value;
    return this.api.post<Profile>(urls.business.profile_store_get, profileData);
  }

  postLocation(business): Observable<Location> {
    const body: any = {
      lat: business.location.lat,
      lng: business.location.lng,
      radius: 50
    };
    return this.api.post<Location>(urls.business.location, body);
  }

  goToPhotos(): void {
    this.currentStep = "photos";
    this.hiddenProfile = true;
    this.business.accounts.accountStatus.code = 101;
    this.goForward();
  }

  storePhotos(): void {
    this.loading = true;
    let logoData: FormData = new FormData();
    logoData.append("photo", this.photosForm.get("logo").value);
    logoData.append("is_logo", 'true');


    let bannerData: FormData = new FormData();
    bannerData.append("photo", this.photosForm.get("banner").value);
    bannerData.append("is_logo", "false");

    let profile: Profile = this.businessService.business$.value.profile;
    forkJoin([
      this.postPhoto(logoData, profile.identifier),
      this.postPhoto(bannerData, profile.identifier)
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe((logoBannerPhotos: [Photos, Photos]) => {
        let photos: Photos = new Photos();
        photos.logo = logoBannerPhotos[0].logo;
        photos.banner = logoBannerPhotos[1].banner;
        this.business.photos = photos;
        this.loading = false;
        this.goToBusiness();
      });
  }

  postPhoto(data: any, profileId: string): Observable<Photos> {
    return this.fileUploader.post<Photos>(urls.business.photos_store, data, profileId);
  }

  goToBusiness() {
    this.currentStep = "business";
    this.hiddenPhotos = true;
    this.business.accounts.accountStatus.code = 102;
    this.goForward();
  }

  storeBusinessAccount(): void {
    this.loading = true;
    this.api
      .post<BusinessAccount>(
        urls.business.account_store_patch,
        this.businessForm.value
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((businessAccount: BusinessAccount) => {
        let business: Business = this.businessService.business$.getValue();
        if (
          business.location.lat == undefined ||
          business.location.lng == undefined
        ) {
          this.geoCodeAddress();
        }
        this.business.accounts.businessAccount = businessAccount;
        this.loading = false;
        this.goToOwner();
      });
  }

  goToOwner(): void {
    this.currentStep = "owner";
    this.hiddenBusinessAccount = true;
    this.business.accounts.accountStatus.code = 103;
    this.goForward();
  }

  storeOwners(): void {
    this.loading = true;
    let responses: Observable<Owner>[] = [];

    this.owners.forEach((owner: Owner) => {
      responses.push(
        this.api.post<Owner>(urls.business.owner_store_patch, owner)
      );
    });
    forkJoin(responses)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((owners: Owner[]) => {
        this.business.accounts.ownerAccounts = owners;
        this.loading = false;
        this.goToBank();
      });
  }

  goToBank(): void {
    this.currentStep = "bank";
    this.hiddenOwner = true;
    this.business.accounts.accountStatus.code = 104;
    this.goForward();
  }

  storeBank(): void {
    this.loading = true;
    this.api
      .post<Bank>(urls.business.bank_store_patch, this.bankForm.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((bank: Bank) => {
        this.business.accounts.bankAccount = bank;
        this.loading = false;
        this.goToMap();
      });
  }

  goToMap(): void {
    this.currentStep = "map";
    this.hiddenBank = true;
    this.business.accounts.accountStatus.code = 105;
    this.goForward();
  }

  storeGeoData(): void {
    this.loading = true;
    this.api
      .patch<Location>(
        urls.business.location,
        this.mapForm.value,
        this.business.location.identifier
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((location: Location) => {
        this.business.location = location;
        this.loading = false;
        this.goToPos();
      });
  }

  goToPos(): void {
    this.currentStep = "pos";
    this.hiddenGeoData = true;
    this.business.accounts.accountStatus.code = 106;
    this.goForward();
  }

  storePosData(): void {
    this.loading = true;
    this.api
      .post<PosAccount>(urls.business.pos_store_patch_get, this.posForm.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((posAccount: PosAccount) => {
        this.business.posAccount = posAccount;
        this.loading = false;
        this.finish();
      });
  }

  finish(): void {
    this.business.accounts.accountStatus.code = 120;
    this.businessService.updateBusiness(this.business);
    this.redirectToOauth();
  }

  goForward(): void {
    this.stepper.next();
  }

  changeOwners(owners: Owner[]): void {
    this.owners = owners;
  }

  geoCodeAddress() {
    let address: string = this.businessForm.get("address").value;
    let secondary: string =
      this.businessForm.get("addressSecondary").value.length != 0
        ? "," + this.businessForm.get("addressSecondary").value
        : "";
    let fullAddress: string = `${address}${secondary}`;

    let city: string = this.businessForm.get("city").value;
    let state: string = this.businessForm.get("state").value;

    let urlFormatAddress: string = `address=${fullAddress},${city},${state}`
      .split(" ")
      .join("+");
    const geoCodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?${urlFormatAddress}&key=${environment.google_api_key}`;
    this.api
      .get(geoCodeUrl)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((place: any) => {
        let location: Location = Object.assign(
          this.businessService.business$.value.location,
          {
            lat: place.results[0].geometry.location.lat,
            lng: place.results[0].geometry.location.lng
          }
        );
        this.businessService.updateLocation(location);
      });
  }

  redirectToOauth(): void {
    const posType: string = this.posForm.get("type").value;
    let url: string = urls.oauth[posType];
    if (url != undefined) {
      this.authService
        .getToken()
        .pipe(takeUntil(this.destroyed$))
        .subscribe((token: NbAuthJWTToken) => {
          url = `${url}&state=${token.getValue()}`;
          window.location.href = url;
        });
    } else {
      this.router.navigate([`/dashboard/home`], {
        queryParams: { oauth: "success" }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
