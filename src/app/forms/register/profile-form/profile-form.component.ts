import { BusinessService } from './../../../services/business.service';
import { GooglePlace } from './../../../models/business/google-place';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Business } from 'src/app/models/business/business';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  placeSet: boolean = false;
  business: Business;

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
    this.updateForm(place);
    this.updateBusiness(place);
    this.updateBusinessService(this.business);
    this.ref.detectChanges();
  }

  updateForm(place: GooglePlace): void {
    this.placeSet = true;
    this.nameControl.patchValue(place.name);
    this.websiteControl.patchValue(place.website);
    this.websiteControl.markAsTouched();
    this.nameControl.disable();
  }

  unsetPlace(): void {
    this.clearForm();
    this.updateBusinessService(this.businessService.newBusiness());
  }

  clearForm(): void {
    this.placeSet = false;
    this.parentFormGroup.reset();
    this.nameControl.enable();
  }

  updateBusiness(place: GooglePlace): void {
    this.business.profile.name = place.name;
    this.business.profile.website = place.website;
    this.business.profile.googlePlaceId = place.placeId;
    this.business.accounts.businessAccount.name = place.name;
    this.business.accounts.businessAccount.address = place.address;
    this.business.location.coords.lat = place.lat;
    this.business.location.coords.lng = place.lng;
  }

  updateBusinessService(business: Business): void {
    this.businessService.updateBusiness(business);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
