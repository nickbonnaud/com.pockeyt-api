import { ConfirmOrCancelDialogComponent } from './confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule } from '@nebular/theme';



@NgModule({
  declarations: [ConfirmOrCancelDialogComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule
  ]
})
export class DialogsModule { }
