import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { POS_TYPES } from 'src/assets/data/pos-types';

@Component({
  selector: 'app-pos-form',
  templateUrl: './pos-form.component.html',
  styleUrls: ['./pos-form.component.scss']
})
export class PosFormComponent implements OnInit {
  @Input() parentFormGroup: FormGroup;

  typeControl: AbstractControl;
  tipsControl: AbstractControl;
  openTicketsControl: AbstractControl;

  posOptions: any[] = POS_TYPES;
  boolOptions: any[] = [
    {name: 'Yes', value: true},
    {name: 'No', value: false}
  ];

  constructor() { }

  ngOnInit(): void {
    this.typeControl = this.parentFormGroup.get('type');
    this.tipsControl = this.parentFormGroup.get('takesTips');
    this.openTicketsControl = this.parentFormGroup.get('allowsOpenTickets');
  }

  markTypeAsDirty(): void {
    if (!this.typeControl.dirty) {
      this.typeControl.markAsDirty();
    }
  }

  markTakesTipsAsDirty(): void {
    if (!this.tipsControl.dirty) {
      this.tipsControl.markAsDirty();
    }
  }

  markOpenTicketsAsDirty(): void {
    if (!this.openTicketsControl.dirty) {
      this.openTicketsControl.markAsDirty();
    }
  }
}
