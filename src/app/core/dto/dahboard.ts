import { DashboardSummary } from "./dashboard-summary";

export class Dashboard {
    resume!: DashboardSummary;
    ticketsByStatus!: { [key: string]: number };
    ticketsByPriority!: { [key: string]: number };
    ticketTrend!: { [key: string]: number };
    slaInRisk!: Array<{ code: string; priority: string; assignedTo: string; timeElapsed: string }>;
    lastTickets!: Array<{ code: string; status: string; priority: string; assignedTo: string }>;
      
}