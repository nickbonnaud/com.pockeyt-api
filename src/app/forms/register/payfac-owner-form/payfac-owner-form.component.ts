import { ConfirmOrCancelDialogComponent } from './../../../dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { STATE_OPTIONS } from 'src/assets/data/states-select';
import { Owner } from 'src/app/models/business/owner';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-payfac-owner-form',
  templateUrl: './payfac-owner-form.component.html',
  styleUrls: ['./payfac-owner-form.component.scss']
})
export class PayfacOwnerFormComponent {
  @Input() parentFormGroup: FormGroup;

  states: string[] = STATE_OPTIONS;
  owners: Owner[] = [];
  primaryChecked = false;

  constructor(private dialogService: NbDialogService) {}

  togglePrimary(checked: boolean) {
    if (checked) {
      const assignedOwner = this.primaryAlreadyAssigned();
      if (assignedOwner !== null) {
        const dialogService: NbDialogRef<ConfirmOrCancelDialogComponent> = this.openDialog(
          assignedOwner
        );
        dialogService.onClose
          .subscribe(changePrimary => {
            if (changePrimary) {
              this.primaryChecked = checked;
              assignedOwner.primary = false;
            }
          })
          .unsubscribe();
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
