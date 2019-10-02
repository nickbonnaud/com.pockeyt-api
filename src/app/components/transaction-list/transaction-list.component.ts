import { NbDialogService } from '@nebular/theme';
import { AssignedTransaction } from './../../models/transaction/assigned-transaction';
import { PaginatorService } from './../../services/paginator.service';
import { ApiService } from './../../services/api.service';
import { urls } from './../../urls/main';
import { Subject } from 'rxjs/internal/Subject';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TransactionDialogComponent } from 'src/app/dialogs/transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
  @Input() transactionType: string;

  private destroyed$: Subject<boolean> = new Subject<boolean>();
  BASE_URL: string = urls.business.transactions;

  transactions: AssignedTransaction[] = [];
  loading: boolean = false;

  constructor(
    private api: ApiService,
    private paginator: PaginatorService,
    private dialogService: NbDialogService
  ){}

  ngOnInit(): void {
    const url: string = `${this.BASE_URL}?type=${this.transactionType}`;
    this.fetchTransactions(url);
  }

  fetchTransactions(url: string): void {
    this.loading = true;
    this.api
      .get<AssignedTransaction[]>(url)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((transactions: AssignedTransaction[]) => {
        this.transactions.push(...transactions);
        this.loading = false;
      });
  }

  getMoreTransactions(): void {
    if (this.loading) {
      return;
    }
    const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
    if (nextUrl != undefined) {
      this.fetchTransactions(nextUrl);
    }
  }

  trackByFn(index: number, transaction: AssignedTransaction): number {
    if (!transaction) return null;
    return index;
  }

  showFullTransaction(transaction: AssignedTransaction): void {
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        transaction: transaction
      }
    });
  }

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
