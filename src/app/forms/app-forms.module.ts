import { OwnerListDialogComponent } from './../dialogs/owner-list-dialog/owner-list-dialog.component';
import { ConfirmOrCancelDialogComponent } from './../dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { ProfileFormComponent } from './register/profile-form/profile-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PayfacBusinessFormComponent } from './register/payfac-business-form/payfac-business-form.component';
import { NbInputModule, NbSelectModule, NbCheckboxModule, NbDialogModule, NbButtonModule, NbIconModule, NbCardModule } from '@nebular/theme';
import { PayfacOwnerFormComponent } from './register/payfac-owner-form/payfac-owner-form.component';
import { NgxMaskModule } from 'ngx-mask';
import { DialogsModule } from '../dialogs/dialogs.module';

@NgModule({
  declarations: [
    PayfacBusinessFormComponent,
    PayfacOwnerFormComponent,
    ProfileFormComponent,
  ],
  entryComponents: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbButtonModule,
    NbIconModule,
    NbCardModule,
    DialogsModule,
    NgxMaskModule.forChild(),
    NbDialogModule.forChild()
  ],
  exports: [PayfacBusinessFormComponent, PayfacOwnerFormComponent, ProfileFormComponent]
})
export class AppFormsModule {}
