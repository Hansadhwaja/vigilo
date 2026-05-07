
import { Incident } from '@/types';
import { useCallback,  useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import TopBar from '../common/TopBar';
import { sampleIncidents } from '@/data/sampleData';
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState("");

    const [incidentList] = useState<Incident[]>(sampleIncidents);
    const [incidentFilter, setIncidentFilter] = useState("all");

    const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

    // const assignNearestToAlarm = useCallback((alarm: Alarm) => {
    //     setAlarmList((prev) =>
    //         prev.map((a) =>
    //             a.id === alarm.id
    //                 ? {
    //                     ...a,
    //                     assigned: alarm.assigned,
    //                     assignedId: alarm.assignedId,
    //                     eta: alarm.eta,
    //                     assignedAt: alarm.assignedAt,
    //                 }
    //                 : a
    //         )
    //     );
    // }, []);

    // const resolveAlarm = useCallback((id: string) => {
    //     setAlarmList((prev) =>
    //         prev.map((a) =>
    //             a.id === id
    //                 ? {
    //                     ...a,
    //                     completed: true,
    //                     completedAt: new Date(),
    //                     responseTime: a.assignedAt
    //                         ? Math.round(
    //                             (new Date().getTime() - new Date(a.assignedAt).getTime()) /
    //                             60000
    //                         )
    //                         : a.sinceMins,
    //                 }
    //                 : a
    //         )
    //     );
    // }, []);

    // const handleIncidentSelect = useCallback((incident: Incident) => {
    //     setSelectedIncident(incident);
    //     navigate(`/incidents/${incident.id}`);
    // }, [navigate]);

    // const handleIncidentBack = useCallback(() => {
    //     setSelectedIncident(null);
    //     navigate('/incidents');
    // }, [navigate]);


    return (
        <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}

            />

            <div className="flex-1 flex flex-col min-h-0 bg-gray-50 min-w-0">

                <TopBar
                    isOpen={sidebarOpen}
                    search={search}
                    onSearchChange={setSearch}
                    onSidebarToggle={toggleSidebar}

                />

                <div className="flex-1 p-4 space-y-4 bg-gray-50 min-h-0 min-w-0">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />

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
                                    onOpen={() => { }}
                                />
                            }
                        />
                        <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
                        <Route
                            path="/alarms"
                            element={
                                <AlarmsPage
                                    alarmList={[]}
                                    onAssign={() => { }}
                                    onResolve={() => { }}
                                    onSelectAlarm={() => { }}
                                />
                            }
                        />
                        <Route
                            path="/map"
                            element={<MapPage onSelectGuard={() => { }} />}
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
                            element={<SettingsPage usageAlarmsMTD={20} />}
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default MainLayout