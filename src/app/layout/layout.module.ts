import { LayoutChangeService } from './services/layout-change.service';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { NbIconModule, NbActionsModule, NbUserModule, NbContextMenuModule, NbLayoutModule, NbSidebarModule, NbMenuService, NbTooltipModule, NbPopoverModule, NbCardModule, NbListModule, NbButtonModule, NbWindowModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { PopOversModule } from '../pop-overs/pop-overs.module';
import { MessageListComponent } from '../pop-overs/message-list/message-list.component';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbLayoutModule,
    NbSidebarModule,
    NbTooltipModule,
    NbPopoverModule,
    NbCardModule,
    NbListModule,
    NbButtonModule,
    PopOversModule,
  ],
  entryComponents: [MessageListComponent],
  exports: [MainComponent],
  providers: [LayoutChangeService, NbMenuService]
})
export class LayoutModule {}
