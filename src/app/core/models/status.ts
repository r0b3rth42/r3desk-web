import { User } from "../../features/models/user";

export interface TicketStatusHistory {
    previousStatus?: string;
    newStatus?: string
    changedBy: User,
    changedAt?: string

}