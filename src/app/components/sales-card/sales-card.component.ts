import { NbCalendarRange } from '@nebular/theme';
import { ApiService } from './../../services/api.service';
import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { urls } from 'src/app/urls/main';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

interface CardStyle {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'sales-card',
  templateUrl: './sales-card.component.html',
  styleUrls: ['./sales-card.component.scss']
})
export class SalesCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() query: string;
  @Input() range: NbCalendarRange<Date>;
  BASE_URL: string;

  private destroyed$: Subject<boolean> = new Subject<boolean>();

  salesData: number;
  loading: boolean = false;
  cards: CardStyle[];
  selectedCard: CardStyle;

  netSalesCard: CardStyle = {
    title: 'Net Sales',
    iconClass: 'shopping-cart',
    type: 'net_sales'
  };

  netTipsCard: CardStyle = {
    title: 'Tips',
    iconClass: 'award',
    type: 'tip'
  };

  netTaxCard: CardStyle = {
    title: 'Taxes',
    iconClass: 'clipboard',
    type: 'tax'
  };

  netTotalCard: CardStyle = {
    title: 'Total',
    iconClass: 'activity',
    type: 'total'
  };

  constructor(private api: ApiService) {
    this.cards = [this.netSalesCard, this.netTaxCard, this.netTipsCard, this.netTotalCard];
  }

  ngOnInit() {
    this.setCardStyle();
    this.BASE_URL = `${urls.business.transactions}?${this.query}`;
    const url: string = this.addDateQuery(this.range);
    this.fetchSalesData(url);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.range.firstChange) {
      if (changes.range.currentValue.start != undefined && changes.range.currentValue.end != undefined) {
        const url: string = this.addDateQuery(changes.range.currentValue);
        this.fetchSalesData(url);
      }
    }
  }

  addDateQuery(range: NbCalendarRange<Date>): string {
    return `${this.BASE_URL}&date[]=${encodeURIComponent(range.start.toISOString())}&date[]=${encodeURIComponent(range.end.toISOString())}`;
  }

  setCardStyle() {
    const index = this.cards.findIndex((card: CardStyle) => {
      return card.type === this.query.replace('sum=', '');
    });
    if (index >= 0) {
      this.selectedCard = this.cards[index];
    }
  }

  fetchSalesData(url: string): void {
    this.loading = true;
    this.api
      .get<any>(url)
      .pipe(
        tap(_ => {},
          err => this.loading = false
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe(data => {
        this.salesData = data.salesData;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
