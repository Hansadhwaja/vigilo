import React, { useMemo, useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// Components
import Sidebar from "./components/common/Sidebar";
import TopBar from "./components/common/TopBar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
// import { Toaster } from "sonner";

// Pages
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import IncidentsPage from "./pages/IncidentsPage";
import IncidentDetailsPage from "./pages/IncidentDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import SchedulingPage from "./pages/SchedulingPage";
// import ShiftPage from "./pages/ShiftPage";
import AlarmsPage from "./pages/AlarmsPage";
import PatrolPage from "./pages/PatrolPage";
import HRPage from "./pages/HRPage";
import ClientsPage from "./pages/ClientsPage";
import MessagesPage from "./pages/MessagesPage";
import InvoicingPage from "./pages/InvoicingPage";
import { AuthPage, GuardDetailsPage } from "./pages";
import OrderDetailsPage from "./pages/OrderDetailsPage";


// Data and utilities
import {
  sampleGuards,
  sampleIncidents,
  sampleAlarms,
  liveMetrics,
} from "./data/sampleData";
import { isSameMonthNow } from "./utils/helpers";
import ProtectedRoute from "./components/ProtectedRoute/ProctedRoute";
import { Toaster } from 'react-hot-toast';
// -------------------- Types --------------------
export interface Guard {
  id: string;
  name: string;
  status: string;
  phone: string;
  licences: string[];
}

export interface Alarm {
  id: string;
  site: string;
  type: string;
  priority: string;
  priorityLevel: number;
  assigned?: string;
  assignedId?: string;
  eta?: string;
  slaTargetMins: number;
  sinceMins: number;
  monitoringCompany: string;
  license: string;
  licenseDetails: string;
  unitPrice: number;
  completed: boolean;
  completedAt: Date | undefined;
  createdAt: Date;
  description: string;
  location: string;
  resolvedAt?: Date;
  responseTime?: number;
  assignedAt?: Date;
}

export interface Incident {
  id: string;
  site: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: string;
  severity: string;
  status: string;
  time: string;
  dateTime: Date;
  assigned?: string;
  assignedId?: string;
  reportedBy: string;
  reporterName: string;
  photo?: string;
  guardMessage: string;
  description: string;
  actionsTaken: string;
  clientNotified: boolean;
  priorityLevel: number;
  resolvedAt?: Date;
  createdAt?: Date;
}

interface KPI {
  onDuty: number;
  openIncidents: number;
  openAlarms: number;
  patrolsDue: number;
  dailyRevenue: number;
  revenueGrowth: number;
  activeContracts: number;
  avgResponseTime: number;
}

// -------------------- MainLayout Component --------------------
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // -------------------- State --------------------
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const [alarmList, setAlarmList] = useState<Alarm[]>(sampleAlarms);

  const [incidentList] = useState<Incident[]>(sampleIncidents);
  const [incidentFilter, setIncidentFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveRevenue, setLiveRevenue] = useState(liveMetrics.hourlyRevenue * 24);
  const [activeBillingCount, setActiveBillingCount] = useState(liveMetrics.activeBilling);

  // Get active tab from current route
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  // -------------------- Derived Metrics --------------------
  const kpi: KPI = useMemo(
    () => ({
      onDuty: sampleGuards.filter((g) => g.status !== "Off Duty").length,
      openIncidents: incidentList.filter((i) => i.status !== "Closed").length,
      openAlarms: alarmList.filter((a) => !a.completed).length,
      patrolsDue: 5,
      dailyRevenue: liveRevenue,
      revenueGrowth: 8.3,
      activeContracts: activeBillingCount,
      avgResponseTime: liveMetrics.responseTimeAvg,
    }),
    [incidentList, alarmList, liveRevenue, activeBillingCount]
  );

  const usageAlarmsMTD = useMemo(
    () =>
      alarmList.filter(
        (a) => a.completed && isSameMonthNow(a.completedAt)
      ).length,
    [alarmList]
  );

  // -------------------- Effects --------------------
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    const updateSLA = () =>
      setAlarmList((prev) =>
        prev.map((a) => ({ ...a, sinceMins: a.sinceMins + 1 }))
      );
    const updateRevenue = () => {
      setLiveRevenue((prev) => prev + (Math.random() * 50 - 25));
      setActiveBillingCount((prev) => prev + (Math.random() > 0.8 ? 1 : 0));
    };

    const timeInterval = setInterval(updateTime, 1000);
    const slaInterval = setInterval(updateSLA, 60000);
    const revenueInterval = setInterval(updateRevenue, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(slaInterval);
      clearInterval(revenueInterval);
    };
  }, []);

  // -------------------- Handlers --------------------
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const handleTabChange = useCallback((tab: string) => {
    navigate(`/${tab === 'dashboard' ? '' : tab}`);
  }, [navigate]);

  const assignNearestToAlarm = useCallback((alarm: Alarm) => {
    setAlarmList((prev) =>
      prev.map((a) =>
        a.id === alarm.id
          ? {
              ...a,
              assigned: alarm.assigned,
              assignedId: alarm.assignedId,
              eta: alarm.eta,
              assignedAt: alarm.assignedAt,
            }
          : a
      )
    );
  }, []);

  const resolveAlarm = useCallback((id: string) => {
    setAlarmList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              completed: true,
              completedAt: new Date(),
              responseTime: a.assignedAt
                ? Math.round(
                    (new Date().getTime() - new Date(a.assignedAt).getTime()) /
                      60000
                  )
                : a.sinceMins,
            }
          : a
      )
    );
  }, []);

  const handleIncidentSelect = useCallback((incident: Incident) => {
    setSelectedIncident(incident);
    navigate(`/incidents/${incident.id}`);
  }, [navigate]);

  const handleIncidentBack = useCallback(() => {
    setSelectedIncident(null);
    navigate('/incidents');
  }, [navigate]);

  // -------------------- Layout --------------------
  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        liveRevenue={liveRevenue}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopBar */}
        <TopBar
          search={search}
          onSearchChange={setSearch}
          onSidebarToggle={toggleSidebar}
        />

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Routes>
            <Route path="/" element={<Dashboard kpi={kpi} />} />
            <Route path="/dashboard" element={<Dashboard kpi={kpi} />} />
            <Route path="/scheduling" element={<SchedulingPage />} />
            {/* <Route path="/shifts" element={<ShiftPage />} /> */}
            <Route path="/clients" element={<ClientsPage />} />
             {/* NEW CLIENT DETAILS ROUTE */}
  <Route path="/clients/:id" element={<OrderDetailsPage />} />
            <Route 
              path="/incidents" 
              element={
                <IncidentsPage
                  list={incidentList}
                  filter={incidentFilter}
                  setFilter={setIncidentFilter}
                  onOpen={handleIncidentSelect}
                />
              } 
            />
            <Route path="/incidents/:id" element={<IncidentDetailsPage />} />


            {/* <Route 
              path="/incidents/:id" 
              element={
                selectedIncident ? (
                  <IncidentDetailsPage
                    incident={selectedIncident}
                    onBack={handleIncidentBack}
                  />
                ) : (
                  <div className="text-center p-8">Incident not found</div>
                )
              } 
            /> */}
            <Route 
              path="/alarms" 
              element={
                <AlarmsPage
                  alarmList={alarmList}
                  onAssign={assignNearestToAlarm}
                  onResolve={resolveAlarm}
                  onSelectAlarm={setSelectedAlarm}
                />
              } 
            />
            <Route 
              path="/map" 
              element={<MapPage onSelectGuard={setSelectedGuard} />} 
            />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/patrol" element={<PatrolPage />} />
            <Route path="/hr" element={<HRPage />} />
            <Route path="/guard-details/:id" element={<GuardDetailsPage />} />
            <Route path="/invoicing" element={<InvoicingPage />} />
            <Route 
              path="/settings" 
              element={<SettingsPage usageAlarmsMTD={usageAlarmsMTD} />} 
            />
          </Routes>
          {/* Toaster Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
        </div>
      </div>

      {/* Guard Details Sheet */}
      <Sheet
        open={!!selectedGuard}
        onOpenChange={() => setSelectedGuard(null)}
      >
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Guard Details</SheetTitle>
            <SheetDescription>
              View guard information, status, and contact details
            </SheetDescription>
          </SheetHeader>

          {selectedGuard && (
            <div className="mt-4 space-y-3">
              <div className="text-lg font-semibold">
                {selectedGuard.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedGuard.status}
              </div>
              <div className="text-sm">Phone: {selectedGuard.phone}</div>
              <div className="text-sm">
                Licences: {selectedGuard.licences.join(", ")}
              </div>

              <div className="pt-3 border-t">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
                  Message
                </button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}

// -------------------- VigiloApp Component --------------------
export default function VigiloApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth route - no sidebar or topbar */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* All other routes - with sidebar and topbar */}
        <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      </Routes>
      {/* Toaster Notifications */}
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}