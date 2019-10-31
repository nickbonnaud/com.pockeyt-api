import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-input-prompt-dialog',
  templateUrl: './input-prompt-dialog.component.html',
  styleUrls: ['./input-prompt-dialog.component.scss']
})
export class InputPromptDialogComponent {
  @Input() title: string;
  @Input() placeholder: string;

  constructor(protected ref: NbDialogRef<InputPromptDialogComponent>) {}

  cancel(): void {
    this.ref.close();
  }

  submit(promptInput: string) {
    this.ref.close(promptInput);
  }

}
