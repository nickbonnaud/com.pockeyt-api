import { LayoutChangeService } from './../services/layout-change.service';
import { Business } from './../../models/business/business';
import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NbSidebarService, NbMediaBreakpointsService, NbThemeService, NbMenuService, NbPopoverDirective } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';
import { ApiService } from 'src/app/services/api.service';
import { Message } from 'src/app/models/other-data/message';
import { urls } from 'src/app/urls/main';
import { Reply } from 'src/app/models/other-data/reply';
import { MessageListComponent } from 'src/app/pop-overs/message-list/message-list.component';


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NbPopoverDirective, { static: false }) popOver: NbPopoverDirective;

  private destroy$: Subject<void> = new Subject<void>();
  message$: Subject<Message> = new Subject<Message>();

  loading: boolean = false;
  BASE_URL: string;

  appName: string = environment.app_name;
  logOutMenu = [{ title: "Log out" }];
  businessPictureOnly = false;

  business: Business;
  messages: Message[];
  unreadMessageCount: number;

  messageList = MessageListComponent;

  constructor(
    private sidebarService: NbSidebarService,
    private layoutChangeService: LayoutChangeService,
    private breakPointService: NbMediaBreakpointsService,
    private themeService: NbThemeService,
    private menuService: NbMenuService,
    private businessService: BusinessService,
    private api: ApiService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.BASE_URL = urls.business.messages;
    const { xl } = this.breakPointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.businessPictureOnly = isLessThanXl)
      );

    this.watchBusiness();
    this.watchMessages();
    this.fetchMessages();
  }

  ngAfterViewInit(): void {
    this.ref.detectChanges();
  }

  fetchMessages(): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<Message[]>(this.BASE_URL)
        .pipe(takeUntil(this.destroy$))
        .subscribe((messages: Message[]) => {
          this.messages = messages;
          this.setMessageBadge();
          this.loading = false;
        });
    }
  }

  setMessageBadge(): void {
    const unreadMessages: Message[] = this.messages.filter(
      (message: Message) => {
        return this.unreadResponse(message);
      }
    );
    this.unreadMessageCount = unreadMessages.length;
  }

  unreadResponse(message: Message): boolean {
    const unreadMessage: boolean = !message.read && !message.sentByBusiness;

    let unreadReply: boolean = false;
    if (message.unreadReply) {
      const unreadReplies: Reply[] = message.replies.filter((reply: Reply) => {
        return !reply.read && !reply.sentByBusiness;
      });
      unreadReply = unreadReplies.length > 0;
    }

    return (unreadMessage || unreadReply);
  }

  watchBusiness(): void {
    this.businessService.business$
      .pipe(takeUntil(this.destroy$))
      .subscribe((business: Business) => {
        this.business = business;
      });
  }

  watchMessages(): void {
    this.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: Message) => {
        this.messages.unshift(message);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.message$.unsubscribe();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutChangeService.changeLayoutSize();
    return false;
  }

  navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }
}
