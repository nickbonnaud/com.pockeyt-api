import { ActiveCustomer } from './../../models/customer/active-customer';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { urls } from 'src/app/urls/main';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginatorService } from 'src/app/services/paginator.service';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();
  BASE_URL: string = urls.business.active_customers;

  customers: ActiveCustomer[] = [];
  loading: boolean = false;

  constructor(private api: ApiService, private paginator: PaginatorService) {}

  ngOnInit(): void {
    this.fetchCustomers(this.BASE_URL);
  }

  fetchCustomers(url: string): void {
    this.loading = true;
    this.api
      .get<ActiveCustomer[]>(url)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((customers: ActiveCustomer[]) => {
        this.customers.push(...customers);
        this.loading = false;
      });
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

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
