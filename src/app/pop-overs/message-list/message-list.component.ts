import { Component, Input } from '@angular/core';
import { Message } from 'src/app/models/other-data/message';
import { NbPopoverDirective, NbWindowService, NbWindowRef } from '@nebular/theme';
import { Subject } from 'rxjs/internal/Subject';
import { NewMessageWindowComponent } from 'src/app/windows/new-message-window/new-message-window.component';
import { Reply } from 'src/app/models/other-data/reply';

@Component({
  selector: "app-message-list",
  templateUrl: "./message-list.component.html",
  styleUrls: ["./message-list.component.scss"]
})
export class MessageListComponent {
  @Input() messages: Message[];
  @Input() popOver: NbPopoverDirective;
  @Input() message$: Subject<Message>;

  constructor(private windowService: NbWindowService) {}

  createNewMessage(): void {
    let windowRef$: Subject<NbWindowRef> = new Subject<NbWindowRef>();
    const windowRef: NbWindowRef = this.windowService.open(
      NewMessageWindowComponent,
      {
        title: "New Message",
        context: { message$: this.message$, windowRef$: windowRef$ }
      }
    );
    windowRef$.next(windowRef);
    windowRef$.unsubscribe();
    this.popOver.hide();
  }

  unreadResponse(message: Message): boolean {
    console.log(message);
    const unreadMessage: boolean = !message.read && !message.sentByBusiness;

    let unreadReply: boolean = false;
    if (message.unreadReply) {
      const unreadReplies: Reply[] = message.replies.filter((reply: Reply) => {
        return !reply.read && !reply.sentByBusiness;
      });
      unreadReply = unreadReplies.length > 0;
    }

    return unreadMessage || unreadReply;
  }

  viewMessageStream(message: Message): void {}

  fetchMoreMessages(): void {}

  trackByFn(index: number, message: Message): number {
    if (!message) {
      return null;
    }
    return index;
  }

  closeMessageList(): void {
    this.popOver.hide();
  }
}
