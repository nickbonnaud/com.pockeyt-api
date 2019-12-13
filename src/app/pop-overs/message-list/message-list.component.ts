import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/other-data/message';
import { NbPopoverDirective, NbWindowService, NbWindowRef } from '@nebular/theme';
import { Subject } from 'rxjs/internal/Subject';
import { NewMessageWindowComponent } from 'src/app/windows/new-message-window/new-message-window.component';
import { Reply } from 'src/app/models/other-data/reply';
import { ChatWindowComponent } from 'src/app/windows/chat-window/chat-window.component';

@Component({
  selector: "app-message-list",
  templateUrl: "./message-list.component.html",
  styleUrls: ["./message-list.component.scss"]
})
export class MessageListComponent {
  @Input() messages: Message[];
  @Input() popOver: NbPopoverDirective;
  @Input() message$: Subject<Message>;
  @Input() fetchMoreMessages$: Subject<boolean>;

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
    this.closeMessageList()
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

    return unreadMessage || unreadReply;
  }

  viewMessageStream(message: Message): void {
    this.windowService.open(
      ChatWindowComponent,
      {
        title: `${message.title.substring(0,20)}...`,
        context: { message: message, message$: this.message$ }
      }
    );
    this.closeMessageList();
  }

  fetchMoreMessages(): void {
    this.fetchMoreMessages$.next(true);
  }

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
