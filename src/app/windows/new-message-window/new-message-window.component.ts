import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { urls } from 'src/app/urls/main';
import { Message } from 'src/app/models/other-data/message';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { NbWindowRef } from '@nebular/theme';

@Component({
  selector: 'app-new-message-window',
  templateUrl: './new-message-window.component.html',
  styleUrls: ['./new-message-window.component.scss']
})
export class NewMessageWindowComponent implements OnInit, OnDestroy {
  @Input() message$: Subject<Message>
  @Input() windowRef$: Subject<NbWindowRef>

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  messageForm: FormGroup;
  loading: boolean = false;
  BASE_URL: string;
  ref: NbWindowRef;

  constructor (
    private api: ApiService
  ) {}

  ngOnInit() {
    this.BASE_URL = urls.business.messages;
    this.setFormControls();

    this.windowRef$.pipe(takeUntil(this.destroyed$)).subscribe((ref: NbWindowRef) => {
      this.ref = ref;
    });
  }

  setFormControls(): void {
    this.messageForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(2)]),
      body: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  submitMessage(): void {
    if (!this.loading) {
      this.loading = true;
      let formData = this.messageForm.value;
      formData["sentByBusiness"] = true;
      this.api
        .post<Message>(this.BASE_URL, formData)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((message: Message) => {
          this.message$.next(message);
          this.loading = false;
          this.ref.close();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
