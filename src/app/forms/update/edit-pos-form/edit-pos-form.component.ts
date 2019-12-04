import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { POS_TYPES } from 'src/assets/data/pos-types';

@Component({
  selector: "edit-pos-form",
  templateUrl: "./edit-pos-form.component.html",
  styleUrls: ["./edit-pos-form.component.scss"]
})
export class EditPosFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;

  typeControl: AbstractControl;
  tipsControl: AbstractControl;
  openTicketsControl: AbstractControl;

  posOptions: any[] = POS_TYPES;

  constructor() {}

  ngOnInit(): void {
    this.typeControl = this.parentFormGroup.get("type");
    this.tipsControl = this.parentFormGroup.get("takesTips");
    this.openTicketsControl = this.parentFormGroup.get("allowsOpenTickets");
  }

  markTypeAsDirty(): void {
    if (!this.typeControl.dirty) {
      this.typeControl.markAsDirty();
    }
  }
}
