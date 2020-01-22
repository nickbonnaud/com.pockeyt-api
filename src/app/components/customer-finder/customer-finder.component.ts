import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { patterns } from 'src/app/forms/validators/patterns';
import { AssignedTransaction } from 'src/app/models/transaction/assigned-transaction';
import { Subject } from 'rxjs/internal/Subject';
import { ApiService } from 'src/app/services/api.service';
import { PaginatorService } from 'src/app/services/paginator.service';
import { urls } from 'src/app/urls/main';
import { takeUntil, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { TransactionDialogComponent } from 'src/app/dialogs/transaction-dialog/transaction-dialog.component';

@Component({
  selector: "customer-finder",
  templateUrl: "./customer-finder.component.html",
  styleUrls: ["./customer-finder.component.scss"]
})
export class CustomerFinderComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  idFinderForm: FormGroup;
  nameFinderForm: FormGroup;

  loading: boolean = false;
  showIDForm: boolean = true;
  flipped: boolean = false;

  transactions: AssignedTransaction[] = [];
  BASE_URL: string;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private paginator: PaginatorService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.buildForms();
  }

  buildForms(): void {
    this.idFinderForm = this.fb.group({
      customerId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(36),
          Validators.maxLength(36)
        ])
      ]
    });

    this.nameFinderForm = this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(patterns.letters_dashes_spaces)
        ])
      ]
    });
  }

  toggleForms(): void {
    this.showIDForm = !this.showIDForm;
  }

  doSearchId(): void {
    if (this.idFinderForm.valid) {
      this.clearPaginator();
      this.BASE_URL = `${urls.business.transactions}?${
        urls.query.customer_transaction
      }${this.idFinderForm.get("customerId").value}`;

      this.fetchTransactions(this.BASE_URL);
    }
  }

  doSearchName(): void {
    if (this.nameFinderForm.valid) {
      this.clearPaginator();
      this.BASE_URL = `${urls.business.transactions}?${
        urls.query.customer_first
      }${this.nameFinderForm.get("firstName").value}&${
        urls.query.customer_last
      }${this.nameFinderForm.get("lastName").value}`;

      this.fetchTransactions(this.BASE_URL);
    }
  }

  fetchTransactions(url: string): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<AssignedTransaction[]>(url)
        .pipe(
          tap(_ => {},
            err => this.loading = false
          ),
          takeUntil(this.destroyed$)
        )
        .subscribe((transactions: AssignedTransaction[]) => {
          this.transactions.push(...transactions);
          this.loading = false;
          this.flipped = true;
        });
    }
  }

  getMoreTransactions(): void {
    if (!this.loading) {
      const nextUrl = this.paginator.getNextUrl(this.BASE_URL);
      if (nextUrl != undefined) {
        this.fetchTransactions(nextUrl);
      }
    }
  }

  resetSearch(): void {
    this.BASE_URL = undefined;
    this.transactions = [];
    this.showIDForm ? this.idFinderForm.reset() : this.nameFinderForm.reset();
    this.flipped = false;
  }

  clearPaginator(): void {
    if (this.BASE_URL != undefined) {
      this.transactions = [];
      this.paginator.removePageData(this.BASE_URL);
    }
  }

  showTransactionDetails(transaction): void {
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        transaction: transaction.transaction,
        customer: transaction.customer
      }
    });
  }

  trackByFn(index: number, transaction: AssignedTransaction): number {
    if (!transaction) return null;
    return index;
  }

  ngOnDestroy(): void {
    this.clearPaginator();
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
