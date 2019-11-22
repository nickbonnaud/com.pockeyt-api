import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { AppFormsModule } from 'src/app/forms/app-forms.module';



@NgModule({
  declarations: [ProfileComponent],
  imports: [
    ComponentsModule,
    AppFormsModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule {}
