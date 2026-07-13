import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/login-request";
import { Observable } from "rxjs";
import { LoginResponse } from "../models/login-response";


@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private readonly http = inject(HttpClient);

  private readonly API =
    'http://localhost:8080/api/auth';

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.API}/login`,
      request
    );
  }
}