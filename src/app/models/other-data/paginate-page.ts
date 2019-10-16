export class PaginatePage {
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    currentPage: number;
    lastPage: number;
    path: string;
  }
}
