import { GooglePlace } from './../../../models/business/google-place';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { Subject } from 'rxjs/internal/Subject';
import { lengthMatchValidator } from '../../validators/length-match-validator';
import { patterns } from '../../validators/patterns';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss']
})
export class BusinessFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() parentFormGroup: FormGroup;
  @Input() googlePlace: GooglePlace;

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

  constructor(private ref: ChangeDetectorRef) {}

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
  }

  ngOnChanges() {
    if (this.googlePlace) {
      this.setInitialValues();
    }
  }

  setInitialValues() {
    this.businessNameControl.setValue(this.googlePlace.name);
    this.businessNameControl.markAsTouched();
    this.addressControl.setValue(`${this.googlePlace.streetNumber} ${this.googlePlace.road}`);
    this.addressControl.markAsTouched();
    this.cityControl.setValue(this.googlePlace.city);
    this.cityControl.markAsTouched();
    this.stateControl.setValue(this.googlePlace.state);
    this.stateControl.markAsDirty();
    this.zipControl.setValue(this.googlePlace.zip);
    this.zipControl.markAsTouched();
    this.ref.detectChanges();
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
