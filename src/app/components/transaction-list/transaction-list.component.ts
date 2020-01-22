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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { CalendarDialogComponent } from 'src/app/dialogs/calendar-dialog/calendar-dialog.component';

interface SelectionOption {
  title: string;
  query: string;
  defaultQuery: string;
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
  selector: "transaction-list",
  templateUrl: "./transaction-list.component.html",
  styleUrls: ["./transaction-list.component.scss"]
})
export class TransactionListComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  selectionOptions: SelectionOption[] = [
    {
      title: "Transaction Status",
      query: `${urls.query.status}<status>`,
      defaultQuery: `${urls.query.status}<status>`,
      value: "status",
      disabled: false,
      selectionToDisable: "",
      selected: false
    },
    {
      title: "Customer ID",
      query: `${urls.query.customer_transaction}<customer>`,
      defaultQuery: `${urls.query.customer_transaction}<customer>`,
      value: "customer_id",
      disabled: false,
      selectionToDisable: "customer_name",
      selected: false
    },
    {
      title: "Employee ID",
      query: `${urls.query.employee_transaction}<employee>`,
      defaultQuery: `${urls.query.employee_transaction}<employee>`,
      value: "employee_id",
      disabled: false,
      selectionToDisable: "",
      selected: false
    },
    {
      title: "Customer Name",
      query: `${urls.query.customer_first}<first>&${urls.query.customer_last}<last>`,
      defaultQuery: `${urls.query.customer_first}<first>&${urls.query.customer_last}<last>`,
      value: "customer_name",
      disabled: false,
      selectionToDisable: "customer_id",
      selected: false
    }
  ];

  loading: boolean = false;
  selectedOptions: SelectionOption[] = [];
  transactions: AssignedTransaction[] = [];
  dateRange: NbCalendarRange<Date>;
  BASE_URL: string;

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
    this.setQueryUrl();
  }

  clearPaginator(): void {
    if (this.BASE_URL != undefined) {
      this.transactions = [];
      this.paginator.removePageData(this.BASE_URL);
    }
  }

  setQueryUrl(): void {
    this.clearPaginator();
    let params: string = "";
    this.selectionOptions.forEach((option: SelectionOption) => {
      if (option.selected) {
        params = params.length > 0 ? `${params}&${option.query}` : option.query;
      }
    });
    params = this.setDateParams(params);
    params = params.length > 0 ? `?${params}` : "";

    this.BASE_URL = `${urls.business.transactions}${params}`;
    this.fetchTransactions(this.BASE_URL);
  }

  setDateParams(params: string): string {
    if (this.dateRange.start != undefined && this.dateRange.end != undefined) {
      return `${params}&${urls.query.date}${encodeURIComponent(
        this.dateRange.start.toISOString()
      )}&${urls.query.date}${encodeURIComponent(
        this.dateRange.end.toISOString()
      )}`;
    }
    return params;
  }

  fetchTransactions(url: string): void {
    if (!this.loading && !url.includes("<") && !url.includes(">")) {
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
        });
    }
  }

  findSelectionByValue(options: SelectionOption[], selection): SelectionOption {
    return options.find((selectionOption: SelectionOption) => {
      return selectionOption.value === selection.value;
    });
  }

  changeSelection(selections: SelectionOption[]): void {
    this.selectionOptions.forEach((select: SelectionOption) => {
      const index = selections.findIndex(selection => selection.value === select.value);
      if (index < 0) {
        select.selected = false;
        select.query = select.defaultQuery;
      }
    });
    const dialogShown: boolean = this.checkDialogs(selections);
    this.selectedOptions = selections;
    this.controlOptions(selections);

    selections.forEach((selection: SelectionOption) => {
      const option: SelectionOption = this.findSelectionByValue(
        this.selectionOptions,
        selection
      );
      option.selected = true;
    });
    if (!dialogShown) {
      this.setQueryUrl();
    }
  }

  checkDialogs(selections: SelectionOption[]): boolean {
    let dialogShown: boolean = false;
    selections.forEach((selection: SelectionOption) => {
      const found: SelectionOption = this.findSelectionByValue(
        this.selectedOptions,
        selection
      );
      if (found == undefined) {
        dialogShown = true;
        this.showDialog(selection);
      }
    });
    return dialogShown;
  }

  showDialog(selection: SelectionOption): void {
    switch (selection.value) {
      case "customer_name":
        this.showCustomerNameDialog(selection);
        break;
      case "employee_id":
        this.showEmployeeListDialog(selection);
        break;
      case "status":
        this.showTransactionStatusDialog(selection);
        break;
      case "customer_id":
        this.showCustomerIdPrompt(selection);
        break;
      default:
        break;
    }
  }

  setQueryParams(selected: SelectionOption, value: string): void {
    const placeHolder = selected.query
      .substr(0, selected.query.indexOf(">") + 1)
      .substring(selected.query.indexOf("<"));
    selected.query = selected.query.replace(placeHolder, value);
    this.setQueryUrl();
  }

  showTransactionStatusDialog(selection: SelectionOption): void {
    this.dialogService
      .open(TransactionStatusPickerDialogComponent)
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((status: Status) => {
        this.deselectOnCancel(selection, status);
        if (status != undefined) {
          const selectedOption: SelectionOption = this.findSelectionByValue(
            this.selectedOptions,
            selection
          );
          this.setQueryParams(selectedOption, status.code.toString());
        }
      });
  }

  showEmployeeListDialog(selection: SelectionOption): void {
    this.dialogService
      .open(EmployeePickerDialogComponent)
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((employee: Employee) => {
        this.deselectOnCancel(selection, employee);
        if (employee != undefined) {
          const selectedOption: SelectionOption = this.findSelectionByValue(
            this.selectedOptions,
            selection
          );
          this.setQueryParams(selectedOption, employee.externalId);
        }
      });
  }

  showCustomerIdPrompt(selection: SelectionOption): void {
    this.dialogService
      .open(InputPromptDialogComponent, {
        context: {
          title: "Customer ID",
          placeholder: "ID"
        }
      })
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe(customerId => {
        this.deselectOnCancel(selection, customerId);
        if (customerId == undefined) {
          this.controlOptions(this.selectedOptions);
          return;
        }
        const selectedOption: SelectionOption = this.findSelectionByValue(
          this.selectedOptions,
          selection
        );
        this.setQueryParams(selectedOption, customerId);
      });
  }

  showCustomerNameDialog(selection: SelectionOption): void {
    this.dialogService
      .open(InputPromptDialogComponent, {
        context: {
          title: "Customer First Name",
          placeholder: "First Name"
        }
      })
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe(firstName => {
        this.deselectOnCancel(selection, firstName);
        if (firstName == undefined) {
          this.controlOptions(this.selectedOptions);
          return;
        }
        const selectedOption: SelectionOption = this.findSelectionByValue(
          this.selectedOptions,
          selection
        );
        this.setQueryParams(selectedOption, firstName);
        this.dialogService
          .open(InputPromptDialogComponent, {
            context: {
              title: "Customer Last Name",
              placeholder: "Last Name"
            }
          })
          .onClose.pipe(takeUntil(this.destroyed$))
          .subscribe(lastName => {
            this.deselectOnCancel(selection, lastName);
            if (lastName == undefined) {
              this.controlOptions(this.selectedOptions);
              return;
            }
            this.setQueryParams(selectedOption, lastName);
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
      const nextUrl: string = this.paginator.getNextUrl(this.BASE_URL);
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

  clearDates(): void {
    this.dateRange = {
      start: undefined,
      end: undefined
    };
    this.setQueryUrl();
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
          this.setQueryUrl();
        }
      });
  }

  ngOnDestroy(): void {
    this.clearPaginator();
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
