export class PaginatePage {
  links: {
    prev: string;
    next: string;
  };
  meta: {
    currentPage: number;
    lastPage: number;
    path: string;
  }
}
