import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Owner } from 'src/app/models/business/owner';
import { STATE_OPTIONS } from 'src/assets/data/states-select';

@Component({
  selector: "edit-owner",
  templateUrl: "./edit-owner.component.html",
  styleUrls: ["./edit-owner.component.scss"]
})
export class EditOwnerComponent implements OnInit, OnChanges {
  @Input() parentFormGroup: FormGroup;
  @Input() owner: Owner;

  states: string[] = STATE_OPTIONS;

  firstNameControl: AbstractControl;
  lastNameControl: AbstractControl;
  titleControl: AbstractControl;
  emailControl: AbstractControl;
  phoneControl: AbstractControl;
  dobControl: AbstractControl;
  ssnControl: AbstractControl;
  addressControl: AbstractControl;
  addressSecondaryControl: AbstractControl;
  cityControl: AbstractControl;
  stateControl: AbstractControl;
  zipControl: AbstractControl;
  percentOwnControl: AbstractControl;
  primaryControl: AbstractControl;

  primaryOptions: any[] = [
    { title: "Yes", value: true },
    { title: "No", value: false }
  ];

  constructor() {}

  ngOnInit() {
    this.setFormControls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFormValues(changes.owner.currentValue);
  }

  setFormValues(owner: Owner): void {
    if (owner.identifier != undefined) {
      let ownerData = Object.assign({}, owner);
      delete ownerData["identifier"];

      let ownerAddress = ownerData.address;
      delete ownerData["address"];

      ownerData = Object.assign({}, ownerData, ownerAddress);
      this.parentFormGroup.setValue(ownerData);
    } else {
      this.parentFormGroup.get('primary').setValue(false);
    }
  }

  markStateAsDirty(): void {
    if (!this.stateControl.dirty) {
      this.stateControl.markAsDirty();
    }
  }

  setFormControls(): void {
    this.firstNameControl = this.parentFormGroup.get("firstName");
    this.lastNameControl = this.parentFormGroup.get("lastName");
    this.titleControl = this.parentFormGroup.get("title");
    this.emailControl = this.parentFormGroup.get("email");
    this.phoneControl = this.parentFormGroup.get("phone");
    this.dobControl = this.parentFormGroup.get("dob");
    this.ssnControl = this.parentFormGroup.get("ssn");
    this.addressControl = this.parentFormGroup.get("address");
    this.addressSecondaryControl = this.parentFormGroup.get("addressSecondary");
    this.cityControl = this.parentFormGroup.get("city");
    this.stateControl = this.parentFormGroup.get("state");
    this.zipControl = this.parentFormGroup.get("zip");
    this.percentOwnControl = this.parentFormGroup.get("percentOwnership");
    this.primaryControl = this.parentFormGroup.get("primary");
  }
}
