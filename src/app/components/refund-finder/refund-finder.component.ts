import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Refund } from 'src/app/models/transaction/refund';
import { Transaction } from 'src/app/models/transaction/transaction';
import { Customer } from 'src/app/models/customer/customer';
import { Employee } from 'src/app/models/employee/employee';
import { AssignedTransaction } from 'src/app/models/transaction/assigned-transaction';
import { urls } from 'src/app/urls/main';
import { ApiService } from 'src/app/services/api.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil, tap } from 'rxjs/operators';

interface RefundData {
  refund: Refund;
  transaction: Transaction;
  customer: Customer,
  employee: Employee
}

@Component({
  selector: "refund-finder",
  templateUrl: "./refund-finder.component.html",
  styleUrls: ["./refund-finder.component.scss"]
})
export class RefundFinderComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  refundIdForm: FormGroup;
  transactionIdForm: FormGroup;

  flipped: boolean = false;
  loading: boolean = false;
  searchByRefundId: boolean = true;

  refund: RefundData;
  transaction: AssignedTransaction;
  BASE_URL: string;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.BASE_URL = urls.business.refunds;
    this.buildForms();
  }

  buildForms(): void {
    this.refundIdForm = this.fb.group({
      refundId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(36),
          Validators.maxLength(36)
        ])
      ]
    });

    this.transactionIdForm = this.fb.group({
      transactionId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(36),
          Validators.maxLength(36)
        ])
      ]
    });
  }

  toggleIdForm(): void {
    this.searchByRefundId = !this.searchByRefundId;
  }

  doSearchRefundId(): void {
    if (this.refundIdForm.valid) {
      const url: string = `${this.BASE_URL}?${urls.query.id}${
        this.refundIdForm.get("refundId").value
      }`;
      this.fetchRefund(url);
    }
  }

  doSearchTransactionId(): void {
    if (this.transactionIdForm.valid) {
      const url: string = `${this.BASE_URL}?${urls.query.refund_trans_id}${
        this.transactionIdForm.get("transactionId").value
      }`;
      this.fetchRefund(url);
    }
  }

  fetchRefund(url: string): void {
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
          if (refunds.length > 0) {
            this.refund = refunds[0];
            delete refunds[0].refund;
            this.transaction = refunds[0];
          }
          this.loading = false;
          this.flipped = true;
        });
    }
  }

  flip(): void {
    this.searchByRefundId
      ? this.refundIdForm.reset()
      : this.transactionIdForm.reset();
    this.refund = undefined;
    this.transaction = undefined;
    this.flipped = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
