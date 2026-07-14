import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/common/Navbar/AppSidebar";
import TopBar from "@/components/common/TopBar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const MainLayout = () => {
  const [search, setSearch] = useState("");

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar />

      <SidebarInset className="min-h-0 min-w-0 bg-background">
        <TopBar search={search} onSearchChange={setSearch} />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background p-4 no-scrollbar">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
