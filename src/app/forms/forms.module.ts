import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './register/profile-form/profile-form.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PayfacBusinessFormComponent } from './register/payfac-business-form/payfac-business-form.component';
import { NbInputModule, NbSelectModule } from '@nebular/theme';



@NgModule({
  declarations: [ProfileFormComponent, PayfacBusinessFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule
  ],
  exports: []
})
export class FormsModule { }
