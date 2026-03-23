import React, { useState, useEffect, useMemo } from "react";
import { 
  DollarSign, 
  Users, 
  Bell, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  Zap, 
  CreditCard,
  Check
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import KPI from "../components/common/KPI";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

import { demoTrend, revenueStreams, liveMetrics } from "../data/sampleData";
// APIs
import { useGetAllGuardsQuery } from "../apis/guardsApi";
import { useGetAllSchedulesQuery } from "../apis/schedulingAPI";
import { useGetAllOrdersQuery } from "../apis/ordersApi";
import { useGetAllPatrolRunsForAdminQuery } from "../apis/patrollingAPI";
import { useGetAllAlarmsQuery } from "../apis/alarmsAPI";

interface DashboardProps {
  kpi: {
    onDuty: number;
    openIncidents: number;
    openAlarms: number;
    patrolsDue: number;
    dailyRevenue: number;
    revenueGrowth: number;
    activeContracts: number;
    avgResponseTime: number;
  };
}

export default function Dashboard({ kpi }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

    const { data: ordersResponse } = useGetAllOrdersQuery({
    limit: 5000,
    page: 1,
  });

  const allOrders = ordersResponse?.data ?? [];

  const buildDateTime = (isoDate: string | null | undefined, time: string | null | undefined) => {
    if (!isoDate || !time) return null;
    const datePart = isoDate.split("T")[0];
    return new Date(`${datePart}T${time}:00`);
  };

  const activeOrdersCount = useMemo(() => {
    const now = new Date();

    return allOrders.filter((order) => {
      if (["cancelled", "completed"].includes(order.status)) {
        return false;
      }
      // Skip if any date/time field is missing
      if (!order.startDate || !order.startTime || !order.endDate || !order.endTime) {
        return false;
      }
      const startDateTime = buildDateTime(order.startDate, order.startTime);
      const endDateTime = buildDateTime(order.endDate, order.endTime);
      if (!startDateTime || !endDateTime) return false;
      return now >= startDateTime && now <= endDateTime;
    }).length;
  }, [allOrders, currentTime]);

   const { data: guardsResponse } = useGetAllGuardsQuery({
    page: 1,
    limit: 5000,
  });

  const { data: schedulesResponse } = useGetAllSchedulesQuery();

  const allGuards = guardsResponse?.data ?? [];
  const schedules = schedulesResponse?.data ?? [];

    const {
    data: patrolResponse,
    isFetching,
  } = useGetAllPatrolRunsForAdminQuery({
    limit: 10,
  });

  const Patrols = patrolResponse?.data || [];
    const { data: alarmsResponse } = useGetAllAlarmsQuery();
    const alarms = alarmsResponse?.data || [];

    const activeAlarmsCount = useMemo(() => {
      return alarms.filter(
        (alarm: any) => String(alarm.status || "").toLowerCase() === "ongoing"
      ).length;
    }, [alarms]);

  const activeShiftsCount = useMemo(() => {
  const now = new Date();

  return schedules.filter((shift: any) => {
    // Ignore completed / cancelled
    if (["completed", "cancelled"].includes(shift.status)) {
      return false;
    }

    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);

    return now >= start && now <= end;
  }).length;
}, [schedules, currentTime]);

const activePatrolsCount = useMemo(() => {
  return Patrols.filter(
    (patrol: any) => String(patrol.status || "").toLowerCase() === "ongoing"
  ).length;
}, [Patrols]);


  // Compute On Duty Guards

  const onDutyGuardIds = useMemo(() => {
    const ids = new Set<string>();

    schedules.forEach((shift: any) => {
      if (shift.status === "ongoing") {
        shift.guards?.forEach((guard: any) => {
          ids.add(guard.id);
        });
      }
    });

    return ids;
  }, [schedules]);

  const onDutyGuardsCount = onDutyGuardIds.size;

  //Compute Available Guards

  const availableGuardsCount = useMemo(() => {
    return allGuards.filter(
      (guard) => !onDutyGuardIds.has(guard.id)
    ).length;
  }, [allGuards, onDutyGuardIds]);

  const line = demoTrend;
  const pieData = [
    { name: "On-time", value: 92 },
    { name: "Late", value: 8 },
  ];
  const colors = ["#22c55e", "#ef4444"];

  // Update time every second for live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Live Status Bar */}
      <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xl font-medium">System Operational</span>
              </div>
              <div className="text-xl text-gray-600">
                Live as of {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-6 text-xl">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Avg Response: {kpi.avgResponseTime}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-green-600" />
                <span>Revenue/Hr: ${(liveMetrics.hourlyRevenue).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary KPIs - Per Scope Requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <KPI 
          icon={<Users className="h-5 w-5" />} 
          label="Available Guards"          //
          value={availableGuardsCount} 
          sub="ready for assignment"
          to="/hr"
        />
        <KPI 
          icon={<Bell className="h-5 w-5" />} 
          label="Active Alarms" 
          value={activeAlarmsCount} 
          sub="requiring response"
          urgent={activeAlarmsCount > 2}
          to="/alarms"
        />
         <KPI 
          icon={<Users className="h-5 w-5" />} 
          label="On Duty Guards" 
          value={onDutyGuardsCount} 
          sub="currently working"
          to="/hr"
        />
        <KPI 
          icon={<Target className="h-5 w-5" />} 
          label="Active Shifts" 
          value={activeShiftsCount} 
          sub="in progress"
          to="/scheduling"
        />

      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <KPI 
          icon={<Target className="h-5 w-5" />} 
          label="Active Orders" 
          value={activeOrdersCount} 
          sub="currently running"
          to="/clients"
        />
        <KPI 
          icon={<Target className="h-5 w-5" />} 
          label="Active Patrols" 
          value={activePatrolsCount} 
          sub="currently patrolling"
          to="/patrol"
        />

        <KPI 
          icon={<DollarSign className="h-5 w-5" />} 
          label="Total Revenue" 
          value={`${Math.round(kpi.dailyRevenue/1000)}k`} 
          sub="monthly total"
          trend="up"
          to="/invoicing"
        />
        <KPI 
          icon={<DollarSign className="h-5 w-5" />} 
          label="Billing Cost" 
          value={`${Math.round(kpi.dailyRevenue * 0.72/1000)}k`} 
          sub="monthly cost"
          to="/invoicing"
        />
      </div>

      {/* KPI Metrics - Per Scope Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Monthly performance metrics and compliance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">Total Completed Patrols</span>
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  124
                </Badge>
              </div>
              <Progress value={82} className="h-2" />
              <div className="text-lg text-gray-500">82% of monthly target (150)</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">SLA Breaches</span>
                <Badge className="bg-red-100 text-red-800">
                  <Clock className="h-3 w-3 mr-1" />
                  3
                </Badge>
              </div>
              <Progress value={15} className="h-2" />
              <div className="text-lg text-red-600">15% breach rate (target: &lt;10%)</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium">Unresolved Incidents</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Bell className="h-3 w-3 mr-1" />
                  {kpi.openIncidents}
                </Badge>
              </div>
              <Progress value={kpi.openIncidents * 10} className="h-2" />
              <div className="text-lg text-gray-500">{kpi.openIncidents} pending resolution</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {revenueStreams.map((stream) => (
          <Card key={stream.name} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl text-gray-600 mb-1">{stream.name}</p>
                  <p className="text-2xl font-bold">${stream.value.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stream.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xl ${stream.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stream.change > 0 ? '+' : ''}{stream.change}%
                    </span>
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg opacity-10"
                  style={{ backgroundColor: stream.color }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Operations Trend</CardTitle>
            <CardDescription>Daily performance metrics with financial data</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={line} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`${value.toLocaleString()}`, 'Revenue'];
                    if (name === 'margin') return [`${value}%`, 'Margin'];
                    return [value, name];
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="incidents" stroke="#6366f1" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="alarms" stroke="#f59e0b" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Stream Distribution</CardTitle>
            <CardDescription>Current month breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={revenueStreams} 
                  dataKey="value" 
                  nameKey="name" 
                  innerRadius={50} 
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {revenueStreams.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Activity Feed</CardTitle>
                <CardDescription>Real-time operations and billing events</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xl text-gray-500">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Revenue Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{currentTime.toLocaleTimeString()}</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-800">Invoice</Badge></TableCell>
                  <TableCell>Alarm response invoice generated</TableCell>
                  <TableCell className="text-green-600">+$55</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10:24</TableCell>
                  <TableCell><Badge>Incident</Badge></TableCell>
                  <TableCell>Trespass reported by A. Khan</TableCell>
                  <TableCell className="text-blue-600">Billable</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>09:11</TableCell>
                  <TableCell><Badge variant="secondary">Tour</Badge></TableCell>
                  <TableCell>Checkpoint #3 scanned - CBD Mall</TableCell>
                  <TableCell className="text-gray-500">Contract</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>08:58</TableCell>
                  <TableCell><Badge className="bg-yellow-100 text-yellow-800">Billing</Badge></TableCell>
                  <TableCell>Monthly contract payment received</TableCell>
                  <TableCell className="text-green-600">+$12,400</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xl">
                <span>Current Shift Cost</span>
                <span className="font-semibold">${liveMetrics.currentShiftCost.toLocaleString()}</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="text-lg text-gray-500">65% of daily budget</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xl">
                <span>Client Satisfaction</span>
                <span className="font-semibold">{liveMetrics.clientSatisfaction}%</span>
              </div>
              <Progress value={liveMetrics.clientSatisfaction} className="h-2" />
              <div className="text-lg text-green-600">Above target (90%)</div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
              <span className="text-xl">Outstanding Invoices</span>
              <Badge variant="outline">{liveMetrics.overdueInvoices}</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => window.location.href = '/invoicing'}>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}