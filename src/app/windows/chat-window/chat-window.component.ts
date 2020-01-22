import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Message } from 'src/app/models/other-data/message';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/models/business/business';
import { environment } from 'src/environments/environment';
import { urls } from 'src/app/urls/main';
import { ApiService } from 'src/app/services/api.service';
import { Reply } from 'src/app/models/other-data/reply';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: "app-chat-window",
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"]
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  @Input() message$: Subject<Message>;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  business: Business;
  adminReplyName: string = environment.app_name;

  BASE_URL: string;
  loading: boolean = false;

  constructor(
    private businessService: BusinessService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.business = this.businessService.business$.value;
    this.BASE_URL = urls.business.replies;
  }

  send(event: any): void {
    if (!this.loading) {
      const replyData: any = {
        messageIdentifier: this.message.identifier,
        body: event.message,
        sentByBusiness: true
      };
      this.loading = true;
      this.api
        .post<Reply>(this.BASE_URL, replyData)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((reply: Reply) => {
          this.message.replies.unshift(reply);
          this.message$.next(this.message);
          this.loading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
