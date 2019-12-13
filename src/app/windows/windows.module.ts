import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMessageWindowComponent } from './new-message-window/new-message-window.component';
import { NbButtonModule, NbInputModule, NbChatModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatWindowComponent } from './chat-window/chat-window.component';



@NgModule({
  declarations: [NewMessageWindowComponent, ChatWindowComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbInputModule,
    NbChatModule,
    ReactiveFormsModule,
  ],
  exports: [NewMessageWindowComponent, ChatWindowComponent]
})
export class WindowsModule { }
