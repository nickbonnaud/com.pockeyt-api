import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmOrCancelDialogComponent } from './confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { NbCardModule, NbButtonModule, NbRadioModule } from '@nebular/theme';
import { OwnerListDialogComponent } from './owner-list-dialog/owner-list-dialog.component';



@NgModule({
  declarations: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbRadioModule
  ],
  exports: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent]
})
export class DialogsModule { }
