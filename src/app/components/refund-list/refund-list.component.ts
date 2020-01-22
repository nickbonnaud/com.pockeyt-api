import { Component, OnInit, OnDestroy } from '@angular/core';
import { Refund } from 'src/app/models/transaction/refund';
import { Transaction } from 'src/app/models/transaction/transaction';
import { Customer } from 'src/app/models/customer/customer';
import { Employee } from 'src/app/models/employee/employee';
import { NbCalendarRange, NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs/internal/Subject';
import { urls } from 'src/app/urls/main';
import { ApiService } from 'src/app/services/api.service';
import { takeUntil, tap } from 'rxjs/operators';
import { CalendarDialogComponent } from 'src/app/dialogs/calendar-dialog/calendar-dialog.component';
import { PaginatorService } from 'src/app/services/paginator.service';
import { TransactionDialogComponent } from 'src/app/dialogs/transaction-dialog/transaction-dialog.component';

interface RefundData {
  refund: Refund;
  transaction: Transaction;
  customer: Customer,
  employee: Employee
}

@Component({
  selector: "refund-list",
  templateUrl: "./refund-list.component.html",
  styleUrls: ["./refund-list.component.scss"]
})
export class RefundListComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  loading: boolean = false;
  refunds: RefundData[] = [];
  dateRange: NbCalendarRange<Date>;
  BASE_URL: string;

  constructor(
    private api: ApiService,
    private dialogService: NbDialogService,
    private paginator: PaginatorService
  ) {
    this.dateRange = {
      start: undefined,
      end: undefined
    }
  }

  ngOnInit() {
    this.getRecentRefunds();
  }

  getRecentRefunds(): void {
    this.BASE_URL = `${urls.business.refunds}?${urls.query.recent_refund}`;
    this.fetchRefunds(this.BASE_URL);
  }

  fetchRefunds(url: string): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<RefundData[]>(url)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((refunds: RefundData[]) => {
          this.refunds.push(...refunds);
          this.loading = false;
        });
    }
  }

  showCalendarDialog(): void {
    this.dialogService
      .open(CalendarDialogComponent, {
        closeOnBackdropClick: false,
        context: {
          title: "Set Date Range",
          range: this.dateRange
        }
      })
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((range: NbCalendarRange<Date>) => {
        if (
          range != undefined &&
          range.start != undefined &&
          range.end != undefined
        ) {
          this.dateRange = range;
          this.clearPaginator();
          this.BASE_URL = `${urls.business.refunds}?${urls.query.date_refund}${this.formatDate(this.dateRange.start)}&${urls.query.date_refund}${this.formatDate(this.dateRange.end)}`;
          this.fetchRefunds(this.BASE_URL);
        }
      });
  }

  formatDate(date: Date): string {
    return encodeURIComponent(date.toISOString());
  }

  getMoreRefunds(): void {
    if (!this.loading) {
      const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
      if (nextUrl != undefined) {
        this.fetchRefunds(nextUrl);
      }
    }
  }

  showTransactionDetails(refund: RefundData): void {
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        transaction: refund.transaction,
        customer: refund.customer
      }
    });
  }

  clearDates(): void {
    this.dateRange = {
      start: undefined,
      end: undefined
    }
    this.clearPaginator();
    this.getRecentRefunds();
  }

  clearPaginator(): void {
    if (this.BASE_URL != undefined) {
      this.refunds = [];
      this.paginator.removePageData(this.BASE_URL);
    }
  }

  trackByFn(index: number, refund: RefundData): number {
    if (!refund) return null;
    return index;
  }

  ngOnDestroy(): void {
    this.clearPaginator();
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
