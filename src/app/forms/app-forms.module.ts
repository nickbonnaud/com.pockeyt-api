import { ProfileFormComponent } from './register/profile-form/profile-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PayfacBusinessFormComponent } from './register/payfac-business-form/payfac-business-form.component';
import { NbInputModule, NbSelectModule, NbCheckboxModule, NbDialogModule } from '@nebular/theme';
import { PayfacOwnerFormComponent } from './register/payfac-owner-form/payfac-owner-form.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [PayfacBusinessFormComponent, PayfacOwnerFormComponent, ProfileFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbCheckboxModule,
    NgxMaskModule.forChild(),
    NbDialogModule.forChild()
  ],
  exports: [PayfacBusinessFormComponent, PayfacOwnerFormComponent, ProfileFormComponent]
})
export class AppFormsModule {}
