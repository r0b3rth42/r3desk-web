import { Area } from "./area";
import { Comment } from "./comment";
import { Grupo } from "./grupo";
import { TicketStatusHistory } from "./status";
import { Usuario } from "./usuario";

export interface Ticket {
    id?: number;
    code?: string;
    title: string;
    description: string;
    status?: string;
    priority: string;
    sourceArea: Area;
    targetArea: Area;
    sourceGroup: Grupo;
    targetGroup: Grupo;
    requester: Usuario;
    assignedTo?: Usuario;
    created?: string;
    histories?: Array<TicketStatusHistory>;
    comments?: Array<Comment>
}