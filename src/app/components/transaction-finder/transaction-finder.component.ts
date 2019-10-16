import { PaginatorService } from 'src/app/services/paginator.service';
import { AssignedTransaction } from './../../models/transaction/assigned-transaction';
import { urls } from './../../urls/main';
import { ApiService } from './../../services/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'transaction-finder',
  templateUrl: './transaction-finder.component.html',
  styleUrls: ['./transaction-finder.component.scss']
})
export class TransactionFinderComponent implements OnInit, OnDestroy {
  BASE_URL: string;
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  transaction: AssignedTransaction;
  transactionIdForm: FormGroup;
  loading: boolean = false;
  flipped: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private paginator: PaginatorService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.BASE_URL = `${urls.business.transactions}?${urls.query.id}`;
  }

  buildForm(): void {
    this.transactionIdForm = this.fb.group({
      transactionId: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(36),
          Validators.maxLength(36)
        ])
      ]
    });
  }

  doSearch(): void {
    if (!this.loading && this.transactionIdForm.valid) {
      this.loading = true;
      this.fetchTransaction();
    }
  }

  flip(): void {
    this.transactionIdForm.reset();
    this.transaction = undefined;
    this.flipped = false;
  }

  fetchTransaction(): void {
    const url: string = `${this.BASE_URL}${this.transactionIdForm.get('transactionId').value}`;
    this.api
      .get<AssignedTransaction[]>(url)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((transaction: AssignedTransaction[]) => {
        if (transaction.length != 0) {
          this.transaction = transaction[0];
        }
        this.loading = false;
        this.flipped = true;
      });
  }

  ngOnDestroy(): void {
    this.paginator.removePageData(this.BASE_URL);
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
