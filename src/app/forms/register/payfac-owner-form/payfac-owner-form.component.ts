import { ConfirmOrCancelDialogComponent } from './../../../dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { Owner } from 'src/app/models/business/owner';
import { NbDialogService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payfac-owner-form',
  templateUrl: './payfac-owner-form.component.html',
  styleUrls: ['./payfac-owner-form.component.scss']
})
export class PayfacOwnerFormComponent implements OnInit, OnDestroy {
  @Input() parentFormGroup: FormGroup;
  @Output() ownerAdded = new EventEmitter<Owner>();

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  states: string[] = STATE_OPTIONS;
  owners: Owner[] = [];
  primaryChecked = false;

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


  constructor(private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.firstNameControl = this.parentFormGroup.get('firstName');
    this.lastNameControl = this.parentFormGroup.get('lastName');
    this.titleControl = this.parentFormGroup.get('title');
    this.emailControl = this.parentFormGroup.get('email');
    this.phoneControl = this.parentFormGroup.get('phone');
    this.dobControl = this.parentFormGroup.get('dob');
    this.ssnControl = this.parentFormGroup.get('ssn');
    this.addressControl = this.parentFormGroup.get('address');
    this.addressSecondaryControl = this.parentFormGroup.get('addressSecondary');
    this.cityControl = this.parentFormGroup.get('city');
    this.stateControl = this.parentFormGroup.get('state');
    this.zipControl = this.parentFormGroup.get('zip');
    this.percentOwnControl = this.parentFormGroup.get('percentOwnership');
    this.primaryControl = this.parentFormGroup.get('primary');

    this.watchPrimary();
  }


  watchPrimary(): void {
    this.primaryControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(isPrimary => {
      if (isPrimary) {
        const assignedOwner = this.primaryAlreadyAssigned();
        if (assignedOwner !== null) {
          this.openDialog(assignedOwner);
        }
      }
    });
  }

  primaryAlreadyAssigned(): Owner | null {
    this.owners.forEach(owner => {
      if (owner.primary) {
        return owner;
      }
    });
    return null;
  }

  openDialog(prevOwner: Owner): void {
    this.dialogService.open(ConfirmOrCancelDialogComponent, {
      context: {
        title: 'Primary Owner already assigned!',
        body: `${prevOwner.firstName} ${prevOwner.lastName} is already assigned as the primary? Do you wish to change?`
      }
    }).onClose.pipe(takeUntil(this.destroyed$)).subscribe(changePrimary => {
      changePrimary ? prevOwner.primary = false : this.primaryControl.setValue(false);
    });
  }

  markStateAsDirty(): void {
    if (!this.stateControl.dirty) {
      this.stateControl.markAsDirty();
    }
  }

  markPrimaryAsDirty(): void {
    if (!this.primaryControl.dirty) {
      this.primaryControl.markAsDirty();
    }
  }

  addOwner(): void {
    console.log(this.percentOwnControl.value);
    const newOwner: Owner = this.parentFormGroup.value;
    this.owners.push(newOwner);
    this.ownerAdded.emit(newOwner);
    this.parentFormGroup.reset();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
