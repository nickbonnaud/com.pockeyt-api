import { Component, OnInit, Input } from '@angular/core';
import { Owner } from 'src/app/models/business/owner';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-owner-list-dialog',
  templateUrl: './owner-list-dialog.component.html',
  styleUrls: ['../dialog-styles.component.scss']
})
export class OwnerListDialogComponent {
  @Input() owners: Owner[];

  selectedOwner: Owner = null;

  constructor(protected ref: NbDialogRef<OwnerListDialogComponent>) {}

  cancel() {
    this.ref.close(null);
  }

  confirm() {
    this.ref.close(this.selectedOwner);
  }

}
