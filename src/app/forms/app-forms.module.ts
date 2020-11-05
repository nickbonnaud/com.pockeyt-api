import { environment } from './../../environments/environment';
import { GooglePlacesDirective } from './../directives/google-places.directive';
import { OwnerListDialogComponent } from './../dialogs/owner-list-dialog/owner-list-dialog.component';
import { ConfirmOrCancelDialogComponent } from './../dialogs/confirm-or-cancel-dialog/confirm-or-cancel-dialog.component';
import { ProfileFormComponent } from './register/profile-form/profile-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { BusinessFormComponent } from './register/business-form/business-form.component';
import { NbInputModule, NbSelectModule, NbCheckboxModule, NbDialogModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { OwnerFormComponent } from './register/owner-form/owner-form.component';
import { NgxMaskModule } from 'ngx-mask';
import { DialogsModule } from '../dialogs/dialogs.module';
import { BankFormComponent } from './register/bank-form/bank-form.component';
import { PhotoFormComponent } from './register/photo-form/photo-form.component';
import { PosFormComponent } from './register/pos-form/pos-form.component';
import { MapFormComponent } from './register/map-form/map-form.component';
import { EditOwnerComponent } from './update/edit-owner/edit-owner.component';
import { EditBankFormComponent } from './update/edit-bank-form/edit-bank-form.component';
import { EditPosFormComponent } from './update/edit-pos-form/edit-pos-form.component';
import { EditDashboardAccountFormComponent } from './update/edit-dashboard-account-form/edit-dashboard-account-form.component';
import { WwwPipe } from './pipes/www.pipe';
import { TimePickerDialogComponent } from '../dialogs/time-picker-dialog/time-picker-dialog.component';

@NgModule({
  declarations: [
    BusinessFormComponent,
    OwnerFormComponent,
    ProfileFormComponent,
    BankFormComponent,
    PhotoFormComponent,
    PosFormComponent,
    GooglePlacesDirective,
    MapFormComponent,
    EditOwnerComponent,
    EditBankFormComponent,
    EditPosFormComponent,
    EditDashboardAccountFormComponent,
    WwwPipe
  ],
  entryComponents: [ConfirmOrCancelDialogComponent, OwnerListDialogComponent, TimePickerDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NbButtonModule,
    NbIconModule,
    DialogsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_api_key
    }),
    NgxMaskModule.forChild(),
    NbDialogModule.forChild()
  ],
  exports: [
    BusinessFormComponent,
    OwnerFormComponent,
    ProfileFormComponent,
    BankFormComponent,
    PhotoFormComponent,
    MapFormComponent,
    PosFormComponent,
    EditOwnerComponent,
    EditBankFormComponent,
    EditPosFormComponent,
    EditDashboardAccountFormComponent
  ]
})
export class AppFormsModule {}
