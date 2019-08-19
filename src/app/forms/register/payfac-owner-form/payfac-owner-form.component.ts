import { ConfirmOrCancelDialogComponent } from './../../../dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { patterns } from '../../validators/patterns';
import { lengthMatchValidator } from '../../validators/length-match-validator';
import { selectionExistsValidator } from '../../validators/selection-exists-validator';
import { booleanValidator } from '../../validators/boolean-validator';
import { primaryOwnerValidator } from '../../validators/primary-owner-validator';
import { Owner } from 'src/app/models/business/owner';
import { numberValidator } from '../../validators/number-validator';
import { percentOwnValidator } from '../../validators/percent-own-validator';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-payfac-owner-form',
  templateUrl: './payfac-owner-form.component.html',
  styleUrls: ['./payfac-owner-form.component.scss']
})
export class PayfacOwnerFormComponent implements OnInit {
  payFacOwnerForm: FormGroup;
  states: string[] = STATE_OPTIONS;
  owners: Owner[] = [];
  primaryChecked = false;

  constructor(private fb: FormBuilder, private dialogService: NbDialogService) {}

  ngOnInit(): void {
    this.payFacOwnerForm = this.fb.group({
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_dashes_spaces_parenthesis),
          lengthMatchValidator(14)
        ])
      ],
      dob: ['', Validators.compose([Validators.required, Validators.pattern(patterns.date)])],
      ssn: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.ssn),
          lengthMatchValidator(11)
        ])
      ],
      address: ['', Validators.compose([Validators.required])],
      addressSecondary: [''],
      city: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required, selectionExistsValidator(this.states)])],
      zip: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.numbers_only),
          lengthMatchValidator(5)
        ])
      ],
      primary: [
        false,
        Validators.compose([
          Validators.required,
          booleanValidator,
          primaryOwnerValidator(this.owners)
        ])
      ],
      percentOwnership: [
        '',
        Validators.compose([Validators.required, numberValidator, percentOwnValidator(this.owners)])
      ]
    });
  }

  payFacOwnerSubmit(): void {
    this.payFacOwnerForm.markAsDirty();
  }

  togglePrimary(checked: boolean) {
    if (checked) {
      const assignedOwner = this.primaryAlreadyAssigned();
      if (assignedOwner !== null) {
        const dialogService: NbDialogRef<
          ConfirmOrCancelDialogComponent
        > = this.openDialog(assignedOwner);
        dialogService.onClose.subscribe(changePrimary => {
          if (changePrimary) {
            this.primaryChecked = checked;
            assignedOwner.primary = false;
          }
        }).unsubscribe();
      } else {
        this.primaryChecked = checked;
      }
    } else {
      this.primaryChecked = checked;
    }
  }

  primaryAlreadyAssigned(): Owner | null {
    this.owners.forEach(owner => {
      if (owner.primary) {
        return owner;
      }
    });
    return null;
  }

  openDialog(owner: Owner) {
    return this.dialogService.open(ConfirmOrCancelDialogComponent, {
      context: {
        title: 'Primary Owner already assigned',
        body: `Change the Primary Owner of this business to ${owner.firstName} ${owner.lastName}?`
      }
    });
  }
}
