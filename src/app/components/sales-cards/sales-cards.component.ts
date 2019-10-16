import { urls } from './../../urls/main';
import { Component } from '@angular/core';
import { NbCalendarRange, NbDateService } from '@nebular/theme';

interface Period {
  title: string;
  value: number;
}

@Component({
  selector: 'sales-cards',
  templateUrl: './sales-cards.component.html',
  styleUrls: ['./sales-cards.component.scss']
})
export class SalesCardsComponent {
  queries: string[] = [
    urls.query.sum_transaction_net_sales,
    urls.query.sum_transaction_tax,
    urls.query.sum_transaction_tip,
    urls.query.sum_transaction_total
  ];

  periods: Period[] = [
    { title: 'Day', value: 1 },
    { title: 'Week', value: 7 },
    { title: 'Month', value: 30 },
    { title: 'Custom', value: null }
  ];

  period: Period = this.periods[0];

  range: NbCalendarRange<Date>;
  flipped: boolean = false;

  constructor(private dateService: NbDateService<Date>) {
    this.setStartDate();
  }

  changePeriod(selection: Period): void {
    this.period = selection;
    this.flipped = selection.value == null;
    this.setStartDate();
  }

  setStartDate(): void {
    if (this.period.value == null) {
      return;
    }
    this.range = {
      start: this.getStartDate(this.period.value),
      end: this.dateService.today()
    }
  }

  getStartDate(daysAgo: number): Date {
    let date = this.dateService.today();
    date.setHours(0, 0, 0, 0);
    return this.dateService.addDay(date, - daysAgo);
  }

  rangeChanged(range: NbCalendarRange<Date>): void {
    if (range.start != undefined && range.end != undefined) {
      this.flipped = false;
    }
  }
}
