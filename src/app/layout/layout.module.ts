import { LayoutChangeService } from './services/layout-change.service';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { NbIconModule, NbActionsModule, NbUserModule, NbContextMenuModule, NbLayoutModule, NbSidebarModule, NbMenuService } from '@nebular/theme';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, MainComponent],
  imports: [
    NbIconModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbLayoutModule,
    NbSidebarModule,
  ],
  exports: [MainComponent],
  providers: [LayoutChangeService, NbMenuService]
})
export class LayoutModule {}
