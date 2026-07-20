import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "@/components/Auth/Routes/ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";

import {
  Dashboard,
  GuardDetailsPage,
  HRPage,
  IncidentDetailsPage,
  IncidentsPage,
  MapPage,
  PatrolPage,
  SalesPage,
  SchedulingPage,
  SettingsPage,
} from "@/pages";

import AlarmsPage from "@/pages/Alarm/AlarmsPage";
import GenerateInvoicePage from "@/pages/Invoicing/GenerateInvoicePage";
import InvoicingPage from "@/pages/Invoicing/InvoicingPage";
import MessagesPage from "@/pages/Messages/MessagesPage";
import PatrolDetailsPage from "@/pages/Patrolling/PatrolDetailsPage";
import OrderDetailsPage from "@/pages/SalesHub/OrderDetailsPage";

import AssignmentDetailsPage from "@/components/AssignmentDetails/AssignmentDetailsPage";
import GuestRoute from "@/components/Auth/Routes/GuestRoute";
import RegisterPage from "@/pages/Auth/RegisterPage";
import LoginPage from "@/pages/Auth/LoginPage";
import AuthLayout from "@/layouts/AuthLayout";
import PlansPage from "@/pages/Plans";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "scheduling",
            children: [
              {
                index: true,
                element: <SchedulingPage />,
              },
              {
                path: ":id",
                element: <AssignmentDetailsPage />,
              },
            ],
          },
          {
            path: "sales",
            children: [
              {
                index: true,
                element: <SalesPage />,
              },
              {
                path: ":id",
                element: <OrderDetailsPage />,
              },
            ],
          },
          {
            path: "plans",
            element: <PlansPage />,
          },
          {
            path: "incidents",
            children: [
              {
                index: true,
                element: <IncidentsPage />,
              },
              {
                path: ":id",
                element: <IncidentDetailsPage />,
              },
            ],
          },
          {
            path: "alarms",
            element: <AlarmsPage />,
          },
          {
            path: "map",
            element: <MapPage onSelectGuard={() => {}} />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
          {
            path: "patrol",
            children: [
              {
                index: true,
                element: <PatrolPage />,
              },
              {
                path: ":id",
                element: <PatrolDetailsPage />,
              },
            ],
          },
          {
            path: "hr",
            children: [
              {
                index: true,
                element: <HRPage />,
              },
              {
                path: "guard-details/:id",
                element: <GuardDetailsPage />,
              },
            ],
          },
          {
            path: "invoicing",
            children: [
              {
                index: true,
                element: <InvoicingPage />,
              },
              {
                path: "new",
                element: <GenerateInvoicePage />,
              },
            ],
          },
          {
            path: "settings",
            element: <SettingsPage usageAlarmsMTD={20} />,
          },
        ],
      },
    ],
  },
]);
