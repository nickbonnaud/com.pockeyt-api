import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

@Component({
  selector: "edit-bank-form",
  templateUrl: "./edit-bank-form.component.html",
  styleUrls: ["./edit-bank-form.component.scss"]
})
export class EditBankFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;

  states: string[] = STATE_OPTIONS;
  typeOptions: any[] = [
    { title: "Checking", value: "checking" },
    { title: "Savings", value: "savings" }
  ];

  firstNameControl: AbstractControl;
  lastNameControl: AbstractControl;
  addressControl: AbstractControl;
  addressSecondaryControl: AbstractControl;
  cityControl: AbstractControl;
  stateControl: AbstractControl;
  zipControl: AbstractControl;
  routingNumberControl: AbstractControl;
  accountNumberControl: AbstractControl;
  typeControl: AbstractControl;

  constructor() {}

  ngOnInit() {
    this.firstNameControl = this.parentFormGroup.get("firstName");
    this.lastNameControl = this.parentFormGroup.get("lastName");
    this.addressControl = this.parentFormGroup.get("address");
    this.addressSecondaryControl = this.parentFormGroup.get("addressSecondary");
    this.cityControl = this.parentFormGroup.get("city");
    this.stateControl = this.parentFormGroup.get("state");
    this.zipControl = this.parentFormGroup.get("zip");
    this.routingNumberControl = this.parentFormGroup.get("routingNumber");
    this.accountNumberControl = this.parentFormGroup.get("accountNumber");
    this.typeControl = this.parentFormGroup.get("accountType");
  }

  markTypeAsDirty(): void {
    if (!this.typeControl.dirty) {
      this.typeControl.markAsDirty();
    }
  }

  markStateAsDirty(): void {
    if (!this.stateControl.dirty) {
      this.stateControl.markAsDirty();
    }
  }
}
