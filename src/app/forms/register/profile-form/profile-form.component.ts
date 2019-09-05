import { BusinessService } from './../../../services/business.service';
import { GooglePlace } from './../../../models/business/google-place';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Business } from 'src/app/models/business/business';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  nameControl: AbstractControl;
  websiteControl: AbstractControl;
  descriptionControl: AbstractControl;

  business: Business;
  placeSet: boolean = false;

  constructor(private ref: ChangeDetectorRef, private businessService: BusinessService) {}

  ngOnInit(): void {
    this.nameControl = this.parentFormGroup.get('name');
    this.websiteControl = this.parentFormGroup.get('website');
    this.descriptionControl = this.parentFormGroup.get('description');

    this.watchBusiness();
  }

  watchBusiness(): void {
    this.businessService.business$.pipe(takeUntil(this.destroyed$)).subscribe((business: Business) => {
      this.business = business;
    });
  }

  setPlace(place: GooglePlace): void {
    this.placeSet = true;
    this.nameControl.patchValue(place.name);
    this.websiteControl.patchValue(place.website);
    this.websiteControl.markAsTouched();
    this.updateBusiness(place);
    this.nameControl.disable();
    this.ref.detectChanges();
  }

  unsetPlace(): void {
    this.placeSet = false;
    this.parentFormGroup.reset();
    this.nameControl.enable();
    this.businessService.updateBusiness(this.businessService.newBusiness());
  }

  updateBusiness(place: GooglePlace): void {
    this.business.profile.name = place.name;
    this.business.profile.website = place.website;
    this.business.profile.googlePlaceId = place.placeId;
    this.business.accounts.businessAccount.name = place.name;
    this.business.accounts.businessAccount.address = place.address;
    this.business.location.coords.lat = place.lat;
    this.business.location.coords.lng = place.lng;
    this.businessService.updateBusiness(this.business);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
