import { takeUntil, tap } from 'rxjs/operators';
import { ApiService } from './../../services/api.service';
import { urls } from './../../urls/main';
import { Subject } from 'rxjs/internal/Subject';
import { NbDialogRef } from '@nebular/theme';
import { Component, OnInit, OnDestroy } from '@angular/core';

interface Status {
  name: string;
  code: number;
}

@Component({
  selector: 'app-transaction-status-picker-dialog',
  templateUrl: './transaction-status-picker-dialog.component.html',
  styleUrls: ['./transaction-status-picker-dialog.component.scss']
})
export class TransactionStatusPickerDialogComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;
  BASE_URL: string = urls.business.transaction_status;

  selectedStatus: Status;
  statuses: Status[] = [];

  constructor (
    private api: ApiService,
    protected ref: NbDialogRef<TransactionStatusPickerDialogComponent>
  )
  {}

  ngOnInit() {
    this.fetchStatuses(this.BASE_URL);
  }

  fetchStatuses(url: string): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<Status[]>(url)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((statuses: Status[]) => {
          this.statuses.push(...statuses);
          this.loading = false;
        })
    }
  }

  submit(): void {
    this.ref.close(this.selectedStatus);
  }

  cancel(): void {
    this.ref.close();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
