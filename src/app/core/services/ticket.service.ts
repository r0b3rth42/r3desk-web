import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';
import { TicketStatusHistory } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private readonly http = inject(HttpClient);

  private readonly API = 'https://2vclckmpu9.execute-api.us-east-1.amazonaws.com/api/';


  list(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.API + 'tickets');
  }

  findByCode(code: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.API}tickets/${code}`)
  }

  save(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.API + 'tickets', ticket);
  }

  changeStatus(status: TicketStatusHistory, ticketId: number) : Observable<TicketStatusHistory> {
    return this.http.patch<TicketStatusHistory>(`${this.API}tickets/${ticketId}/status`, status);
  }

  addComment(ticketId: number,comments: string): Observable<any> {
    return this.http.post(`${this.API}tickets/${ticketId}/comments`,{message: comments});
  }

  resolveTicket(request: any, ticketId: number ) : Observable<any> {
    return this.http.post(`${this.API}tickets/${ticketId}/resolve`, request);
  }

  
}