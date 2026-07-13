import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged(): boolean {

    return !!localStorage.getItem(
      'access_token'
    );
  }

  getToken(): string {

    return localStorage.getItem(
      'access_token'
    ) ?? '';
  }

  logout(): void {

    localStorage.clear();
  }
}