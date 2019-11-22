import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

@Component({
  selector: 'bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.scss']
})
export class BankFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;


  states: string[] = STATE_OPTIONS;
  accountTypeOptions: any[] = [
    {title: 'Checking', value: 'checking'},
    {title: 'Savings', value: 'savings'}
  ]

  firstNameControl: AbstractControl;
  lastNameControl: AbstractControl;
  addressControl: AbstractControl;
  addressSecondaryControl: AbstractControl;
  cityControl: AbstractControl;
  stateControl: AbstractControl;
  zipControl: AbstractControl;
  routingControl: AbstractControl;
  accountNumberControl: AbstractControl;
  accountTypeControl: AbstractControl;

  constructor() { }

  ngOnInit() {
    this.firstNameControl = this.parentFormGroup.get('firstName');
    this.lastNameControl = this.parentFormGroup.get('lastName');
    this.addressControl = this.parentFormGroup.get('address');
    this.addressSecondaryControl = this.parentFormGroup.get('addressSecondary');
    this.cityControl = this.parentFormGroup.get('city');
    this.stateControl = this.parentFormGroup.get('state');
    this.zipControl = this.parentFormGroup.get('zip');
    this.routingControl = this.parentFormGroup.get('routing');
    this.accountNumberControl = this.parentFormGroup.get('accountNumber');
    this.accountTypeControl = this.parentFormGroup.get('accountType');
  }

  markAccountTypeAsDirty(): void {
    if (!this.accountTypeControl.dirty) {
      this.accountTypeControl.markAsDirty();
    }
  }

   markStateAsDirty(): void {
    if (!this.stateControl.dirty) {
      this.stateControl.markAsDirty();
    }
  }

}
