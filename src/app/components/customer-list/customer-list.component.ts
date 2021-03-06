import { TransactionDialogComponent } from 'src/app/dialogs/transaction-dialog/transaction-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { urls } from './../../urls/main';
import { ActiveCustomer } from './../../models/customer/active-customer';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginatorService } from 'src/app/services/paginator.service';


@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() query: string;
  @Output() loadingCustomers = new EventEmitter<boolean>()

  private destroyed$: Subject<boolean> = new Subject<boolean>();
  BASE_URL: string;

  customers: ActiveCustomer[] = [];
  loading: boolean;

  constructor(
    private api: ApiService,
    private paginator: PaginatorService,
    private dialogService: NbDialogService
  )
  {}

  ngOnInit(): void {
    this.loading = false;
    this.loadingCustomers.emit(false);
    this.BASE_URL = `${urls.business.customers}?${this.query}`;
    this.fetchCustomers(this.BASE_URL);
  }

  changeLoading(): void {
    this.loading = !this.loading;
    this.loadingCustomers.emit(this.loading);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.query.firstChange) {
      this.paginator.removePageData(this.BASE_URL);
      this.customers = [];
      this.query = changes.query.currentValue;
      this.BASE_URL = `${urls.business.customers}?${this.query}`;
      this.fetchCustomers(this.BASE_URL);
    }
  }

  fetchCustomers(url: string): void {
    if (!this.loading) {
      this.changeLoading();
      this.api
        .get<ActiveCustomer[]>(url)
        .pipe(
          tap(_ => {},
            err => this.changeLoading()
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((customers: ActiveCustomer[]) => {
          this.customers.push(...customers);
          this.changeLoading();
        });
    }
  }

  getMoreCustomers(): void {
    if (this.loading) {
      return;
    }
    const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
    if (nextUrl != undefined) {
      this.fetchCustomers(nextUrl);
    }
  }

  trackByFn(index: number, customer: ActiveCustomer): number {
    if (!customer) return null;
    return index;
  }

  showTransactionDetails(activeCustomer: ActiveCustomer): void {
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        transaction: activeCustomer.transaction,
        customer: activeCustomer.customer
      }
    })
  }

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
