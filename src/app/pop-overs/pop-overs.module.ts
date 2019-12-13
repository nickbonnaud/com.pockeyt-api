import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from './message-list/message-list.component';
import { NbCardModule, NbButtonModule, NbListModule, NbIconModule, NbWindowModule, NbInputModule } from '@nebular/theme';
import { NewMessageWindowComponent } from '../windows/new-message-window/new-message-window.component';
import { WindowsModule } from '../windows/windows.module';



@NgModule({
  declarations: [MessageListComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbIconModule,
    WindowsModule,
    NbWindowModule.forChild()
  ],
  entryComponents: [NewMessageWindowComponent],
  exports: [MessageListComponent]
})
export class PopOversModule {}
