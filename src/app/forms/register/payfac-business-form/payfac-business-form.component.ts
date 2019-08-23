import { takeUntil } from 'rxjs/operators';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ENTITY_TYPE_OPTIONS } from 'src/assets/data/entity-types-select';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-payfac-business-form',
  templateUrl: './payfac-business-form.component.html',
  styleUrls: ['./payfac-business-form.component.scss']
})
export class PayfacBusinessFormComponent implements OnInit, OnDestroy {
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

  constructor() {}

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

  markStateAsDirty() {
    this.stateControl.markAsDirty();
  }

  markBusinessTypeAsDirty() {
    this.entityTypeControl.markAsDirty();
  }

  watchEntityType() {
    this.entityTypeControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      value === 'soleProprietorship' ? this.disableEin() : this.einControl.enable();
    });
  }

  disableEin() {
    this.einControl.setValue('');
    this.einControl.disable();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
