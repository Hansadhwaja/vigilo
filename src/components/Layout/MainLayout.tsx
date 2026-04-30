import { Guard } from '@/apis/guardsApi';
import { Alarm, Incident, KPI } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../common/TopBar';
import { liveMetrics, sampleAlarms, sampleGuards, sampleIncidents } from '@/data/sampleData';
import { isSameMonthNow } from '@/utils/helpers';
import { ClientsPage, Dashboard, GuardDetailsPage, HRPage, IncidentDetailsPage, IncidentsPage, MapPage, PatrolPage, SchedulingPage, SettingsPage } from '@/pages';
import OrderDetailsPage from '@/pages/OrderDetailsPage';
import AssignmentDetailsPage from '../AssignmentDetails/AssignmentDetailsPage';
import MessagesPage from '@/pages/Messages/MessagesPage';
import PatrolDetailsPage from '@/pages/PatrolDetailsPage';
import InvoicingPage from '@/pages/Invoicing/InvoicingPage';
import Sidebar from '../common/Navbar/Sidebar';
import GenerateInvoicePage from '@/pages/Invoicing/GenerateInvoicePage';
import InvoiceDetailsPage from '@/pages/Invoicing/InvoiceDetailsPage';
import AlarmsPage from '@/pages/Alarm/AlarmsPage';

const MainLayout = () => {
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


    return (
        <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                liveRevenue={liveRevenue}
            />

            <div className="flex-1 flex flex-col min-h-0 bg-gray-50">

                <TopBar
                    search={search}
                    onSearchChange={setSearch}
                    onSidebarToggle={toggleSidebar}
                    liveRevenue={liveRevenue}
                />

                <div className="flex-1 p-4 space-y-4 bg-gray-50 min-h-0">
                    <Routes>
                        <Route path="/" element={<Dashboard kpi={kpi} />} />
                        <Route path="/dashboard" element={<Dashboard kpi={kpi} />} />
                        <Route path="/scheduling" element={<SchedulingPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/clients/:id" element={<OrderDetailsPage />} />
                        <Route path="/scheduling/:id" element={<AssignmentDetailsPage />} />
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
                        <Route path="/patrol/:id" element={<PatrolDetailsPage />} />
                        <Route path="/hr" element={<HRPage />} />
                        <Route path="/guard-details/:id" element={<GuardDetailsPage />} />

                        <Route path="/invoicing" >
                            <Route index element={<InvoicingPage />} />
                            <Route path="new" element={<GenerateInvoicePage />} />
                            <Route path=":invoiceId" element={<InvoiceDetailsPage />} />
                        </Route>

                        <Route
                            path="/settings"
                            element={<SettingsPage usageAlarmsMTD={usageAlarmsMTD} />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default MainLayout