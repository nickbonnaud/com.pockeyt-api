import { PaginatePage } from './../models/other-data/paginate-page';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  paginateData: PaginatePage[] = [];

  constructor() {}

  addPageData(page: PaginatePage): void {
    const index: number = this.getPage(page.meta.path);
    if (index >= 0) {
      this.paginateData[index] = page;
    } else {
      this.paginateData.push(page);
    }
  }

  removePageData(baseUrl): void {
    const index: number = this.getPage(baseUrl);
    if (index >= 0) {
      this.paginateData.splice(index, 1);
    }
  }

  getNextUrl(baseUrl: string): string {
    const index: number = this.getPage(baseUrl);
    return this.paginateData[index].links.next;
  }

  getPrevUrl(baseUrl: string): string {
    const index: number = this.getPage(baseUrl);
    return this.paginateData[index].links.prev;
  }

  private getPage(path: string): number {
    return this.paginateData.findIndex((storedPage: PaginatePage) => {
      return path === storedPage.meta.path;
    });
  }
}
