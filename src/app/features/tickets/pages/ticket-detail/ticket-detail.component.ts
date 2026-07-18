import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket';
import { FormsModule } from '@angular/forms';
import { TicketStatusHistory } from '../../../../core/models/status';
import { User } from '../../../models/user';
import { Comment } from '../../../../core/models/comment';
import { StatusList } from '../../../../core/dto/status-list';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly ticket = signal<Ticket | null>(null);

  //comentarios
  newComment = '';

  readonly history = signal<StatusList[]>([]);

  readonly comments = signal<Comment[]>([]);


  //resolution
  showResolutionDialog = false;

  resolution = {
    summary: '',
    rootCause: ''
  };

  ngOnInit(): void {

    const code = this.route.snapshot.paramMap.get('id');

    if (!code) {

      this.error.set('Ticket code not provided');
      this.loading.set(false);

      return;
    }

    this.loadTicket(code);
  }

  private loadTicket(code: string): void {

    this.loading.set(true);
    this.error.set(null);

    this.ticketService.findByCode(code).subscribe({

      next: ticket => {

        this.ticket.set(ticket);

        if (ticket.comments) {
          this.comments.set(
            ticket.comments.map(c => ({
              id: c.id,
              author: c.author,
              date: c.date,
              comment: c.comment
            }))
          );
        } else {
          this.comments.set([]);
        }

        if (ticket.histories) {
          this.history.set(
            ticket.histories.map(h => ({
              status: h.newStatus,
              user: h.changedBy.username,
              date: h.changedAt
            }))
          )
        }

        this.loading.set(false);

      },

      error: err => {

        console.error(err);

        this.error.set(
          'Unable to load ticket information'
        );

        this.loading.set(false);

      }

    });

  }

  readonly currentUser = signal({
    id: 2,
    username: 'angel',
    role: 'REVIEWER'
  });

  readonly isReviewer = computed(() => {

    const ticket = this.ticket();

    if (!ticket) return false;

    //
    //return (
    //  this.currentUser().role === 'REVIEWER' &&
    //  ticket.assignedTo?.id === this.currentUser().id
    //);
    return true;

  });

  readonly isRequester = computed(() => {

    const ticket = this.ticket();

    if (!ticket) return false;

    //return ticket.requester?.id === this.currentUser().id;
    return true;
  });

  readonly nextStatuses = computed(() => {

    const ticket = this.ticket();

    if (!ticket) return [];

    switch (ticket.status) {

      case 'REGISTERED':
        return ['PENDING ASSIGN']

      case 'ASSIGNED':
        return ['IN_PROGRESS'];

      case 'IN_PROGRESS':
        return [
          'PENDING_CUSTOMER',
          'RESOLVED'
        ];

      case 'PENDING_CUSTOMER':
        return [
          'IN_PROGRESS'
        ];

      case 'RESOLVED':
        return [
          'CLOSED'
        ];

      default:
        return [];

    }

  });

  changeStatus(event: Event) {

    const status = (event.target as HTMLSelectElement).value;

    if (status === 'RESOLVED') {
      this.showResolutionDialog = true;
      return;
    }

    const ticket = this.ticket();

    if (!ticket) {
      return;
    }

    let user: User = {
      ... this.currentUser()
    }

    let newStatus: TicketStatusHistory = {
      newStatus: status,
      changedBy: user
    }
    console.log("cambiando de estado")

    this.ticketService
      .changeStatus(newStatus, ticket.id!)
      .subscribe({

        next: updated => {
          ticket.status = status;
          this.ticket.set(ticket);

        }

      });


  }

  confirmResolution() {

    const ticket = this.ticket();
  
    if (!ticket) {
      return;
    }
  
    const user: User = {
      ...this.currentUser()
    };
  
    const resolved  = {
      status: 'RESOLVED',
      rootCause: this.resolution.rootCause,
      summary: this.resolution.summary,
      user: user
    };
  
    this.ticketService
        .resolveTicket(resolved, ticket.id!)
        .subscribe({
  
          next: () => {  
            ticket.status = 'RESOLVED';
            this.showResolutionDialog = false;
          }
  
        });
  
  }

  addComment() {

    if (!this.newComment.trim()) {
      return;
    }

    const ticket = this.ticket();

    if (!ticket) {
      return;
    }



    let message = this.newComment;



    this.ticketService.addComment(ticket.id!, message)
      .subscribe({

        next: () => {
          console.log("llego a guardar y entro en cambiar comentarios")
          //inventado
          this.comments.update(c => [

            ...c,

            {

              id: 100,

              author: this.currentUser().username,

              date: new Date().toLocaleString(),

              message: this.newComment

            }

          ]);
          // hasta aqui, po mientras

          this.newComment = '';

        },

        error: err => console.error(err)

      });

  }

}