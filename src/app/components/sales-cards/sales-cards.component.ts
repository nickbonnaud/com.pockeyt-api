import { urls } from './../../urls/main';
import { Component } from '@angular/core';
import { NbCalendarRange, NbDateService, NbDialogService } from '@nebular/theme';
import { CalendarDialogComponent } from 'src/app/dialogs/calendar-dialog/calendar-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

interface Period {
  title: string;
  value: number;
}

@Component({
  selector: "sales-cards",
  templateUrl: "./sales-cards.component.html",
  styleUrls: ["./sales-cards.component.scss"]
})
export class SalesCardsComponent {
  private destroyed$: Subject<boolean> = new Subject<boolean>();

  queries: string[] = [
    urls.query.sum_transaction_net_sales,
    urls.query.sum_transaction_tax,
    urls.query.sum_transaction_tip,
    urls.query.sum_transaction_total
  ];

  periods: Period[] = [
    { title: "Day", value: 1 },
    { title: "Week", value: 7 },
    { title: "Month", value: 30 },
    { title: "Custom", value: null }
  ];

  period: Period = this.periods[0];
  range: NbCalendarRange<Date>;

  constructor(
    private dateService: NbDateService<Date>,
    private dialogService: NbDialogService
  ) {
    this.setStartDate();
  }

  changePeriod(selection: Period): void {
    this.period = selection;
    this.setStartDate();
  }

  setStartDate(): void {
    if (this.period.value == null) {
      this.showCalendarDialog();
    } else {
      this.range = {
        start: this.getStartDate(this.period.value),
        end: this.dateService.today()
      };
    }
  }

  getStartDate(daysAgo: number): Date {
    let date = this.dateService.today();
    date.setHours(0, 0, 0, 0);
    return this.dateService.addDay(date, -daysAgo);
  }

  showCalendarDialog(): void {
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
          this.range = range;
        }
      });
  }
}
