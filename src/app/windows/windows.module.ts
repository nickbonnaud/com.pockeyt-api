import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMessageWindowComponent } from './new-message-window/new-message-window.component';
import { NbButtonModule, NbInputModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [NewMessageWindowComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbInputModule,
    ReactiveFormsModule,
  ],
  exports: [NewMessageWindowComponent]
})
export class WindowsModule { }
