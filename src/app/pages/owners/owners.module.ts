import { NgModule } from '@angular/core';
import { OwnersComponent } from './owners.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { NbCardModule, NbButtonModule, NbListModule, NbUserModule, NbIconModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [OwnersComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    AppFormsModule,
    NbCardModule,
    NbButtonModule,
    NbUserModule,
    NbIconModule,
    ReactiveFormsModule,
    NbListModule
  ]
})
export class OwnersModule {}
