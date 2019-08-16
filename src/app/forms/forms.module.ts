import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './register/profile-form/profile-form.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PayfacBusinessFormComponent } from './register/payfac-business-form/payfac-business-form.component';
import { NbInputModule, NbSelectModule } from '@nebular/theme';
import { EinPipe } from './pipes/ein.pipe';



@NgModule({
  declarations: [ProfileFormComponent, PayfacBusinessFormComponent, EinPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule
  ],
  exports: []
})
export class FormsModule { }
