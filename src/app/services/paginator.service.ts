import { PaginatePage } from './../models/other-data/paginate-page';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  paginateData: PaginatePage[] = [];

  constructor() {}

  addPageData(page: PaginatePage): void {
    const index: number = this.getPage(page.links.first);
    if (index >= 0) {
      this.paginateData[index] = page;
    } else {
      this.paginateData.push(page);
    }
  }

  removePageData(url): void {
    const index: number = this.getPage(url);
    if (index >= 0) {
      this.paginateData.splice(index, 1);
    }
  }

  getNextUrl(url: string): string {
    const index: number = this.getPage(url);
    return this.paginateData[index].links.next;
  }

  getPrevUrl(url: string): string {
    const index: number = this.getPage(url);
    return this.paginateData[index].links.prev;
  }

  private getPage(url: string): number {
    return this.paginateData.findIndex((storedPage: PaginatePage) => {
      return this.stripPaginateQuery(url) === this.stripPaginateQuery(storedPage.links.first);
    });
  }

  private stripPaginateQuery(url: string) : string {
    let pageIndex: number = url.indexOf('&page');
    if (pageIndex >= 0) {
      return url.substring(0, pageIndex);
    }
    pageIndex = url.indexOf('?page');
    if (pageIndex >= 0) {
      return url.substring(0, pageIndex);
    }
    return url;
  }
}
