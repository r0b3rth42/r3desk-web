import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket';

interface Tickt {
  id: string;
  title: string;
  status: string;
  priority: string;
  area: string;
  grupo: string;
  createdDate: string;
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent {

  private readonly ticketService = inject(TicketService)

  searchTerm = signal('');
  statusFilter = signal('');
  priorityFilter = signal('');

  readonly tickts = signal<Ticket[]>([]);

  constructor() {

    this.loadTickets();

  }

  ngOnInit(): void {
  
  }

  loadTickets(){
    this.ticketService.list().subscribe( lista => this.tickts.set(lista))
  }

  filteredTickets = computed(() => {

    const search = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this.tickts().filter(ticket => {

      const matchesSearch =
        !search ||
        ticket.id!.toString().toLowerCase().includes(search) ||
        ticket.title.toLowerCase().includes(search) ||
        ticket.targetArea.nombre.toLowerCase().includes(search) ||
        ticket.targetGroup.nombre.toLowerCase().includes(search);

      const matchesStatus =
        !status || ticket.status === status;

      const matchesPriority =
        !priority || ticket.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;

    });

  });

}