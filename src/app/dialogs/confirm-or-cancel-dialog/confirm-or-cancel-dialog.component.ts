import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-or-cancel-dialog',
  templateUrl: './confirm-or-cancel-dialog.component.html',
  styleUrls: ['../dialog-styles.component.scss']
})
export class ConfirmOrCancelDialogComponent {
  @Input() title: string;
  @Input() body: string;

  constructor(protected ref: NbDialogRef<ConfirmOrCancelDialogComponent>) {}

  cancel(): void {
    this.ref.close(false);
  }

  confirm(): void {
    this.ref.close(true);
  }
}
