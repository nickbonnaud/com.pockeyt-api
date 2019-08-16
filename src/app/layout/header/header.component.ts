import { LayoutChangeService } from './../services/layout-change.service';
import { Business } from './../../models/business/business';
import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSidebarService, NbMediaBreakpointsService, NbThemeService, NbMenuService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  appName: string = environment.app_name;
  logOutMenu = [{ title: 'Log out' }];
  businessPictureOnly = false;
  business: Business;

  constructor(
    private sidebarService: NbSidebarService,
    private layoutChangeService: LayoutChangeService,
    private breakPointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private menuService: NbMenuService
  ) {}

  ngOnInit(): void {
    const { xl } = this.breakPointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      ).subscribe((isLessThanXl: boolean) => this.businessPictureOnly = isLessThanXl);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutChangeService.changeLayoutSize();
    return false;
  }

  navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }
}
