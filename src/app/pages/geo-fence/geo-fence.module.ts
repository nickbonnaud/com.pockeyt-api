import { NgModule } from '@angular/core';
import { GeoFenceComponent } from './geo-fence.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { AppFormsModule } from 'src/app/forms/app-forms.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [GeoFenceComponent],
  imports: [
    ComponentsModule,
    NbCardModule,
    NbButtonModule,
    AppFormsModule,
    ReactiveFormsModule
  ]
})
export class GeoFenceModule {}
