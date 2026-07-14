import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { navLinks } from "@/constants";
import LogoutModal from "@/components/Auth/Modal/LogoutModal";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar
      collapsible="icon"
      className={cn("border-r border-sidebar-border")}
    >
      {/* Brand */}
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="VIGILO"
              className={cn("h-14 rounded-xl px-3", "hover:bg-sidebar-accent")}
            >
              <Link to="/">
                <img
                  src="/assets/logo/logo.png"
                  alt="VIGILO"
                  className="size-8 object-contain"
                />

                <div className="grid flex-1 leading-tight">
                  <span className="truncate text-xl font-bold tracking-tight text-sidebar-primary">
                    VIGILO
                  </span>

                  <span className="truncate text-sm text-sidebar-foreground/60">
                    Workforce & Monitoring
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-5 group-data-[collapsible=icon]:px-2">
        <SidebarMenu className="gap-2">
          {navLinks.map((item) => {
            const isActive =
              item.link === "/"
                ? pathname === "/"
                : pathname.startsWith(item.link);

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={isActive}
                  className={cn(
                    "group h-12 rounded-xl px-3",
                    "text-sidebar-foreground/70",
                    "transition-all duration-200",
                    "hover:bg-sidebar-primary/10",
                    "hover:text-sidebar-primary",
                    "data-[active=true]:bg-sidebar-primary/10",
                    "data-[active=true]:text-sidebar-primary",
                  )}
                >
                  <Link to={item.link}>
                    <item.icon
                      className={cn(
                        "size-5 shrink-0",
                        "transition-transform duration-200",
                        "group-hover:scale-110",
                      )}
                      strokeWidth={2.2}
                    />

                    <span className="truncate text-base font-medium">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutModal>
              <SidebarMenuButton
                asChild
                tooltip="Logout"
                className={cn(
                  "h-12 rounded-xl",
                  "group-data-[collapsible=icon]:size-12",
                  "group-data-[collapsible=icon]:p-0",
                )}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "h-12 w-full justify-start gap-3 rounded-xl px-3",
                    "text-base font-medium text-destructive",
                    "hover:bg-destructive/10 hover:text-destructive",
                    "group-data-[collapsible=icon]:size-12",
                    "group-data-[collapsible=icon]:justify-center",
                    "group-data-[collapsible=icon]:p-0",
                  )}
                >
                  <LogOut className="size-5 shrink-0" />

                  <span className="group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </Button>
              </SidebarMenuButton>
            </LogoutModal>
          </SidebarMenuItem>
        </SidebarMenu>

        <p className="mt-1 text-center text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} Vigilo
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
