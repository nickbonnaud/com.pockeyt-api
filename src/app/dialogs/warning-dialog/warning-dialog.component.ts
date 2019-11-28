import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss']
})
export class WarningDialogComponent {
  @Input() title: string;
  @Input() body: string;

  constructor(protected ref: NbDialogRef<WarningDialogComponent>) { }

  confirm(): void {
    this.ref.close();
  }

}
