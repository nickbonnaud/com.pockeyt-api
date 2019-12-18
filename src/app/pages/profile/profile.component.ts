import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { urls } from 'src/app/urls/main';
import { Profile } from 'src/app/models/business/profile';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { FormControlProviderService } from 'src/app/forms/services/form-control-provider.service';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  profileForm: FormGroup;
  profile: Profile;

  formLocked: boolean = true;
  loading: boolean = false;
  BASE_URL: string;

  constructor(
    private api: ApiService,
    private fcProvider: FormControlProviderService,
    private businessService: BusinessService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.profile_store_get;
    this.profileForm = this.fcProvider.registerProfileControls();
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        let profile = business.profile;
        delete profile["identifier"];
        this.setProfileForm(profile);
        this.profileForm.disable();
      });
  }

  setProfileForm(profile: Profile): void {
    this.profile = profile;
    let formData = Object.assign({}, profile);
    delete formData['identifier'];
    this.profileForm.setValue(formData);
  }

  submit(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .patch<Profile>(this.BASE_URL, this.profileForm.value, this.profile.identifier)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((profile: Profile) => {
          this.setProfileForm(profile);
          this.toggleLock();
          this.businessService.updateProfile(profile);
          this.loading = false;
        });
    }
  }

  toggleLock(): void {
    this.formLocked = !this.formLocked;
    this.profileForm.disabled
      ? this.profileForm.enable()
      : this.profileForm.disable();
    if (this.formLocked) {
      this.setProfileForm(this.profile);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
