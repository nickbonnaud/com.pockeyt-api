import { NbCalendarRange, NbDialogService, NbDateService } from '@nebular/theme';
import { urls } from './../../urls/main';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { CalendarDialogComponent } from 'src/app/dialogs/calendar-dialog/calendar-dialog.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { FormControl } from '@angular/forms';

interface SelectionOption {
  title: string;
  statusQuery: string;
  value: string;
}

@Component({
  selector: "customers-in-location",
  templateUrl: "./customers-in-location.component.html",
  styleUrls: ["./customers-in-location.component.scss"]
})
export class CustomersInLocationComponent implements OnInit {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  selectionOptionsActive: SelectionOption[] = [
    {
      title: "With Transaction",
      statusQuery: `${urls.query.customer_active}&${urls.query.customer_with_transaction}`,
      value: "active_with_transaction"
    },
    {
      title: "Without Transaction",
      statusQuery: `${urls.query.customer_active}&${urls.query.customer_without_transaction}`,
      value: "active_without_transaction"
    }
  ];

  selectionOptionsHistoric: SelectionOption[] = [
    {
      title: "With Transaction",
      statusQuery: `${urls.query.customer_historic}&${urls.query.customer_with_transaction}`,
      value: "historic_with_transaction"
    },
    {
      title: "Without Transaction",
      statusQuery: `${urls.query.customer_historic}&${urls.query.customer_without_transaction}`,
      value: "historic_without_transaction"
    }
  ];

  selectedStatusFormControl: FormControl = new FormControl();
  selectedStatus: SelectionOption;

  range: NbCalendarRange<Date> = {
    start: undefined,
    end: undefined
  };

  baseQuery: string;
  transactionQuery: string = "";
  dateQuery: string = "";
  fullQuery: string = "";

  constructor(
    private dialogService: NbDialogService,
  ) {}

  ngOnInit(): void {
    this.resetSelection();
    this.baseQuery = this.selectedStatusFormControl.value.statusQuery;
    this.setFullQuery();
    this.watchSelection();
  }

  watchSelection(): void {
    this.selectedStatusFormControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((selection: SelectionOption) => {
        if (selection.value.startsWith("historic")) {
          this.selectedStatusFormControl.markAsTouched();
          this.showCalendarDialog(selection);
        } else {
          this.range = {
            start: undefined,
            end: undefined
          };
          this.selectedStatus = selection;
          this.baseQuery = selection.statusQuery;
          this.dateQuery = "";
          this.transactionQuery = "";
          this.setFullQuery();
        }
      });
  }

  showCalendarDialog(selection: SelectionOption): void {
    this.dialogService
      .open(CalendarDialogComponent, {
        closeOnBackdropClick: false,
        context: {
          title: "Select Date Range",
          range: this.range
        }
      })
      .onClose.pipe(takeUntil(this.destroyed$))
      .subscribe((range: NbCalendarRange<Date>) => {
        if (range != undefined) {
          this.selectedStatus = selection;
          this.baseQuery = selection.statusQuery;
          this.range = range;
          this.addDateRangeToQuery(range);
        } else {
          this.selectedStatusFormControl.setValue(this.selectedStatus);
          this.clearDates();
          this.setFullQuery();
        }
      });
  }

  removeDates(): void {
    this.resetSelection();
    this.setFullQuery();
  }

  resetSelection(): void {
    this.selectedStatusFormControl.setValue(this.selectionOptionsActive[0]);
    this.selectedStatus = this.selectedStatusFormControl.value;
    this.clearDates();
  }

  clearDates(): void {
    this.range = {
      start: undefined,
      end: undefined
    };
    this.dateQuery = "";
  }

  setFullQuery(): void {
    this.fullQuery = this.baseQuery + this.transactionQuery + this.dateQuery;
  }

  addDateRangeToQuery(range: NbCalendarRange<Date>): void {
    this.dateQuery = `&${urls.query.date}${encodeURIComponent(
      range.start.toISOString()
    )}&${urls.query.date}${encodeURIComponent(range.end.toISOString())}`;
    this.setFullQuery();
  }
}
