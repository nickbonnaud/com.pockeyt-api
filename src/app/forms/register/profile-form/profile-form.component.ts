import { BusinessService } from './../../../services/business.service';
import { GooglePlace } from './../../../models/business/google-place';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Business } from 'src/app/models/business/business';
import { OpenHours } from 'src/app/models/business/open-hours';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HOURS_SELECT } from "src/assets/data/hours-select";
import { NbDialogService } from '@nebular/theme';
import { TimePickerDialogComponent } from 'src/app/dialogs/time-picker-dialog/time-picker-dialog.component';
import { Profile } from 'src/app/models/business/profile';

@Component({
  selector: "profile-form",
  templateUrl: "./profile-form.component.html",
  styleUrls: ["./profile-form.component.scss"]
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  nameControl: AbstractControl;
  websiteControl: AbstractControl;
  descriptionControl: AbstractControl;
  googleIdControl: AbstractControl;
  phoneControl: AbstractControl;
  hoursControl: AbstractControl;

  placeSet: boolean = false;
  websiteFormFocused: boolean = false;
  business: Business;

  operatingHours: any[] = HOURS_SELECT;
  amPmSelect: any[] = [
    { period: "am", value: "am" },
    { period: "pm", value: "pm" }
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private businessService: BusinessService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.nameControl = this.parentFormGroup.get("name");
    this.websiteControl = this.parentFormGroup.get("website");
    this.descriptionControl = this.parentFormGroup.get("description");
    this.googleIdControl = this.parentFormGroup.get("googlePlaceId");
    this.phoneControl = this.parentFormGroup.get("phone");
    this.hoursControl = this.parentFormGroup.get('hours');

    this.watchBusiness();
  }

  watchBusiness(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((business: Business) => {
        this.business = business;
        this.checkHoursValid(business);
      });
  }

  checkHoursValid(business: Business): void {
    let profile: Profile = business.profile;
    if (profile.hours == undefined) {
      business.profile.hours = new OpenHours();
      this.hoursControl.setErrors({ invalid: true });
      this.updateBusinessService(business);
    } else {
      let hoursValid: boolean =
        profile.hours.monday != null &&
        profile.hours.tuesday != null &&
        profile.hours.wednesday != null &&
        profile.hours.thursday != null &&
        profile.hours.friday != null &&
        profile.hours.saturday &&
        profile.hours.sunday != null;
      hoursValid
        ? this.hoursControl.setErrors(null)
        : this.hoursControl.setErrors({ invalid: true });
    }
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
    this.googleIdControl.patchValue(place.placeId);
    this.phoneControl.patchValue(place.phone);
    this.websiteControl.markAsTouched();
    this.phoneControl.markAsTouched();
    this.nameControl.disable();
  }

  unsetPlace(): void {
    this.clearForm();
    this.updateBusinessService(this.businessService.newBusiness());
  }

  clearForm(): void {
    this.placeSet = false;
    this.websiteFormFocused = false;
    this.parentFormGroup.reset();
    this.nameControl.enable();
  }

  updateBusiness(place: GooglePlace): void {
    this.business.profile.name = place.name;
    this.business.profile.website = place.website;
    this.business.profile.googlePlaceId = place.placeId;
    this.business.profile.phone = place.phone;
    this.business.profile.hours = place.hours;
    this.business.accounts.businessAccount.businessName = place.name;
    this.business.accounts.businessAccount.address = place.address;
    this.business.location.lat = place.lat;
    this.business.location.lng = place.lng;
  }

  updateBusinessService(business: Business): void {
    this.businessService.updateBusiness(business);
  }

  focusWebsiteInput(): void {
    if (!this.websiteFormFocused) {
      this.websiteFormFocused = true;
    }
  }

  openHoursDialog(day: string): void {
    this.dialogService
      .open(TimePickerDialogComponent, {
        closeOnBackdropClick: false,
        context: {
          day: day
        }
      }).onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((hours: string) => {
        if (hours != undefined) {
          switch (day) {
            case 'Monday':
              this.business.profile.hours.monday = hours;
              break;
            case 'Tuesday':
              this.business.profile.hours.tuesday = hours;
              break;
            case 'Wednesday':
              this.business.profile.hours.wednesday = hours;
              break;
            case 'Thursday':
              this.business.profile.hours.thursday = hours;
              break;
            case 'Friday':
              this.business.profile.hours.friday = hours;
              break;
            case 'Saturday':
              this.business.profile.hours.saturday = hours;
              break;
            case 'Sunday':
              this.business.profile.hours.sunday = hours;
              break;
          }
          this.updateBusinessService(this.business);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
