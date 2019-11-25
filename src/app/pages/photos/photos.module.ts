import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { PhotosComponent } from './photos.component';



@NgModule({
  declarations: [PhotosComponent],
  imports: [
    ComponentsModule,
    AppFormsModule,
    NbCardModule,
    NbButtonModule,
    ReactiveFormsModule
  ]
})
export class PhotosModule {}
