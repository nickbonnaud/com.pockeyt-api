import { Token } from './../models/business/token';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  private token: Token;

  constructor() { }

  getToken(): Token {
    return this.token;
  }

  setToken(token: Token): void {
    this.token = token;
  }
}
