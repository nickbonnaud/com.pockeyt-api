import { TransactionStatusPickerDialogComponent } from './../../dialogs/transaction-status-picker-dialog/transaction-status-picker-dialog.component';
import { Employee } from './../../models/employee/employee';
import { EmployeePickerDialogComponent } from './../../dialogs/employee-picker-dialog/employee-picker-dialog.component';
import { InputPromptDialogComponent } from './../../dialogs/input-prompt-dialog/input-prompt-dialog.component';
import { TransactionDialogComponent } from 'src/app/dialogs/transaction-dialog/transaction-dialog.component';
import { PaginatorService } from 'src/app/services/paginator.service';
import { ApiService } from './../../services/api.service';
import { NbCalendarRange, NbDialogService } from '@nebular/theme';
import { AssignedTransaction } from './../../models/transaction/assigned-transaction';
import { urls } from 'src/app/urls/main';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

interface SelectionOption {
  title: string;
  query: string;
  value: string;
  disabled: boolean;
  selectionToDisable: string;
  selected: boolean;
}

interface Status {
  name: string;
  code: number;
}

@Component({
  selector: 'transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  selectionOptions: SelectionOption[] = [
    {
      title: 'Transaction Status',
      query: `${urls.query.status}<status>`,
      value: 'status',
      disabled: false,
      selectionToDisable: '',
      selected: false
    },
    {
      title: 'Customer ID',
      query: `${urls.query.customer_transaction}<customer>`,
      value: 'customer_id',
      disabled: false,
      selectionToDisable: 'customer_name',
      selected: false
    },
    {
      title: 'Employee ID',
      query: `${urls.query.employee_transaction}<employee>`,
      value: 'employee_id',
      disabled: false,
      selectionToDisable: '',
      selected: false
    },
    {
      title: 'Customer Name',
      query: `${urls.query.customer_first}<first>&${urls.query.customer_last}<last>`,
      value: 'customer_name',
      disabled: false,
      selectionToDisable: 'customer_id',
      selected: false
    }
  ];

  flipped: boolean = false;
  loading: boolean = false;
  selectedOptions: SelectionOption[] = [];
  transactions: AssignedTransaction[] = [];
  dateRange: NbCalendarRange<Date>;
  BASE_URL: string;

  customerFirst: string;
  customerLast: string;
  employee: Employee;
  status: Status;

  constructor(
    private api: ApiService,
    private paginator: PaginatorService,
    private dialogService: NbDialogService
  ) {
    this.dateRange = {
      start: undefined,
      end: undefined
    };
  }

  ngOnInit(): void {
    this.BASE_URL = `${urls.business.transactions}?${this.setQueryParams()}`;
    this.fetchTransactions(this.BASE_URL);
  }

  setQueryParams(): string {
    let params: string = '';
    this.selectionOptions.forEach((option: SelectionOption) => {
      if (option.selected) {
        params = params.length > 0 ? `${params}&${option.query}` : option.query;
      }
    });
    params = this.setDateParams(params);
    return params;
  }

  setDateParams(params: string): string {
    if (this.dateRange.start != undefined && this.dateRange.end != undefined) {
      return `${params}&${urls.query.date}${encodeURIComponent(
        this.dateRange.start.toISOString()
      )}&${urls.query.date}${encodeURIComponent(this.dateRange.end.toISOString())}`;
    }
    const query: string = urls.query.recent_transaction;
    return params.length > 0 ? `${params}&${query}` : query;
  }

  fetchTransactions(url: string): void {
    if (!this.loading) {
      this.loading = true;
      this.api
        .get<AssignedTransaction[]>(url)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((transactions: AssignedTransaction[]) => {
          this.transactions.push(...transactions);
          this.loading = false;
        });
    }
  }

  changeSelection(selections: SelectionOption[]): void {
    this.checkDialogs(selections);
    this.selectedOptions = selections;
    this.controlOptions(selections);

    this.selectionOptions.forEach((select: SelectionOption) => {
      select.selected = false;
    });
    selections.forEach((selection: SelectionOption) => {
      const option: SelectionOption = this.selectionOptions.find(
        (selectOption: SelectionOption) => {
          return selectOption.value === selection.value;
        }
      );
      option.selected = true;
    });
    this.setQueryParams();
  }

  checkDialogs(selections: SelectionOption[]): void {
    selections.forEach((selection: SelectionOption) => {
      let found = this.selectedOptions.find((option: SelectionOption) => {
        selection.value == option.value;
      });
      if (found == undefined) {
        this.showDialog(selection);
      }
    });
  }

  showDialog(selection: SelectionOption): void {
    switch (selection.value) {
      case 'customer_name':
        this.showCustomerNameDialog(selection);
        break;
      case 'employee_id':
        this.showEmployeeListDialog(selection);
        break;
      case 'status':
        this.showTransactionStatusDialog(selection);
        break;
      default:
        break;
    }
  }

  showTransactionStatusDialog(selection: SelectionOption): void {
    this.dialogService
      .open(TransactionStatusPickerDialogComponent)
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((status: Status) => {
        this.deselectOnCancel(selection, status);
        this.status = status;
      });
  }

  showEmployeeListDialog(selection: SelectionOption): void {
    this.dialogService
      .open(EmployeePickerDialogComponent)
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((employee: Employee) => {
        this.deselectOnCancel(selection, employee);
        this.employee = employee;
      });
  }

  showCustomerNameDialog(selection: SelectionOption): void {
    this.dialogService
      .open(InputPromptDialogComponent, {
        context: {
          title: 'Customer First Name',
          placeholder: 'First Name'
        }
      })
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe(firstName => {
        this.deselectOnCancel(selection, firstName);
        this.customerFirst = firstName;
        this.dialogService
          .open(InputPromptDialogComponent, {
            context: {
              title: 'Customer Last Name',
              placeholder: 'Last Name'
            }
          })
          .onClose.pipe(takeUntil(this.destroyed$))
          .subscribe(lastName => {
            this.deselectOnCancel(selection, lastName);
            this.customerLast = lastName;
          });
      });
  }

  deselectOnCancel(selection: SelectionOption, value: any): void {
    if (value == undefined) {
      selection.selected = false;
      this.selectedOptions = this.selectedOptions.filter(
        option => option.value !== selection.value
      );
    }
  }

  controlOptions(selections: SelectionOption[]): void {
    this.enableOptions();
    this.disableOptions(selections);
  }

  enableOptions(): void {
    this.selectionOptions.forEach((option: SelectionOption) => {
      option.disabled = false;
    });
  }

  disableOptions(selections: SelectionOption[]): void {
    selections.forEach((selection: SelectionOption, index: number) => {
      if (selection.selectionToDisable.length > 0) {
        let option: SelectionOption = this.selectionOptions.find(
          (selectionOption: SelectionOption) => {
            return selectionOption.value === selection.selectionToDisable;
          }
        );
        option.disabled = true;
      }
    });
  }

  getMoreTransactions(): void {
    if (!this.loading) {
      const nextUrl = this.paginator.getNextUrl(this.BASE_URL);
      if (nextUrl != undefined) {
        this.fetchTransactions(nextUrl);
      }
    }
  }

  trackByFn(index: number, transaction: AssignedTransaction): number {
    if (!transaction) return null;
    return index;
  }

  showTransactionDetails(transaction: AssignedTransaction): void {
    this.dialogService.open(TransactionDialogComponent, {
      context: {
        transaction: transaction.transaction,
        customer: transaction.customer
      }
    });
  }

  showDatePicker(): void {
    this.flipped = true;
  }

  clearDates(): void {
    this.dateRange = {
      start: undefined,
      end: undefined
    };
    this.flipped = false;
  }

  dateRangeChanged(range: NbCalendarRange<Date>): void {
    this.dateRange = range;
    if (range.start != undefined && range.end != undefined) {
      this.flipped = false;
    }
  }
}
