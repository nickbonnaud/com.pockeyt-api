import { BusinessService } from './../../../services/business.service';
import { Business } from 'src/app/models/business/business';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { Subject } from 'rxjs/internal/Subject';
import { lengthMatchValidator } from '../../validators/length-match-validator';
import { patterns } from '../../validators/patterns';

@Component({
  selector: 'business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss']
})
export class BusinessFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  entityTypes: any[] = ENTITY_TYPE_OPTIONS;
  states: string[] = STATE_OPTIONS;

  businessNameControl: AbstractControl;
  addressControl: AbstractControl;
  addressSecondaryControl: AbstractControl;
  cityControl: AbstractControl;
  stateControl: AbstractControl;
  zipControl: AbstractControl;
  entityTypeControl: AbstractControl;
  einControl: AbstractControl;

  business: Business;

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.businessNameControl = this.parentFormGroup.get('businessName');
    this.addressControl = this.parentFormGroup.get('address');
    this.addressSecondaryControl = this.parentFormGroup.get('addressSecondary');
    this.cityControl = this.parentFormGroup.get('city');
    this.stateControl = this.parentFormGroup.get('state');
    this.zipControl = this.parentFormGroup.get('zip');
    this.entityTypeControl = this.parentFormGroup.get('entityType');
    this.einControl = this.parentFormGroup.get('ein');

    this.watchEntityType();
    this.watchBusiness();
  }

  watchBusiness(): void {
    this.businessService.business$.pipe(takeUntil(this.destroyed$)).subscribe((business: Business) => {
      this.setFormValues(business)
      this.markFormValues();
    });
  }

  setFormValues(business: Business): void {
    this.businessNameControl.patchValue(business.accounts.businessAccount.businessName);
    this.addressControl.patchValue(business.accounts.businessAccount.address.address);
    this.cityControl.patchValue(business.accounts.businessAccount.address.city);
    this.stateControl.patchValue(business.accounts.businessAccount.address.state);
    this.zipControl.patchValue(business.accounts.businessAccount.address.zip);
  }

  markFormValues(): void {
    Object.keys(this.parentFormGroup.controls).forEach(key => {
      if (this.parentFormGroup.controls[key].value != null) {
        if (this.parentFormGroup.controls[key].value.length > 0) {
          this.parentFormGroup.controls[key].markAsDirty();
          this.parentFormGroup.controls[key].markAsTouched();
        }
      } else {
        this.parentFormGroup.controls[key].markAsPristine();
        this.parentFormGroup.controls[key].markAsUntouched();
      }
    });
  }

  markStateAsDirty(): void {
    if (!this.stateControl.dirty) {
      this.stateControl.markAsDirty();
    }
  }

  markBusinessTypeAsDirty(): void {
    if (!this.entityTypeControl.dirty) {
      this.entityTypeControl.markAsDirty();
    }
  }

  watchEntityType(): void {
    this.entityTypeControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(entityType => {
      if (entityType === 'soleProprietorship') {
        this.disableEin();
        this.removeEinValidators();
      } else {
        this.einControl.enable();
        this.addEinValidators();
      }
    });
  }

  addEinValidators() {
    this.einControl.setValidators([Validators.required, Validators.pattern(patterns.numbers_only), lengthMatchValidator(9)]);
    this.einControl.updateValueAndValidity();
  }

  removeEinValidators() {
    this.einControl.clearValidators();
    this.einControl.updateValueAndValidity();
  }

  disableEin(): void {
    this.einControl.setValue('');
    this.einControl.disable();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
