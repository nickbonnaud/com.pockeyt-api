import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { POS_TYPES } from 'src/assets/data/pos-types';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: "pos-form",
  templateUrl: "./pos-form.component.html",
  styleUrls: ["./pos-form.component.scss"]
})
export class PosFormComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  @Input() parentFormGroup: FormGroup;

  typeControl: AbstractControl;
  tipsControl: AbstractControl;
  openTicketsControl: AbstractControl;

  posOptions: any[] = POS_TYPES;
  boolOptions: any[] = [
    { name: "Yes", value: true },
    { name: "No", value: false }
  ];

  constructor() {}

  ngOnInit(): void {
    this.typeControl = this.parentFormGroup.get("type");
    this.tipsControl = this.parentFormGroup.get("takesTips");
    this.openTicketsControl = this.parentFormGroup.get("allowsOpenTickets");
    this.watchPosType();
  }

  watchPosType(): void {
    this.typeControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(type => {
        type === "shopify"
          ? (this.tipsControl.setValue(false), this.tipsControl.disable())
          : (this.tipsControl.disabled ? (this.tipsControl.enable(), this.tipsControl.reset()) : '');
      });
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

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
