export interface PatrolCompletion {
  day: string;
  count: number;
}

export interface DashboardStats {
  onDutyGuards: number;
  activeShifts: number;
  activePatrols: number;
  activeAlarms: number;
  activeOrders: number;
  incidentsToday: number;
  patrolsCompletedToday: number;
  alarmsResolvedToday: number;
  patrolCompletionsLast7Days: PatrolCompletion[];
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}