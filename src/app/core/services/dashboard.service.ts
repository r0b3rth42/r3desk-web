import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from '../dto/dahboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/';


  getSummary(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.API}dashboard`);
  }

  
}