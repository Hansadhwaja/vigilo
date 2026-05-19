import { useState } from "react";
import {
  Search,
  LogOut,
  Edit,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetProfileQuery } from "@/apis/profileApi";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { toast } from "sonner";

import MobileSidebar from "./Navbar/MobileSidebar";
import UserAvatar from "./Avatar/UserAvatar";
import NotificationModal from "../Notification/Modal/NotificationModal";

interface TopBarProps {
  search: string;
  isOpen: boolean;
  onSearchChange: (value: string) => void;
  onSidebarToggle: () => void;
}

export default function TopBar({
  isOpen,
  search,
  onSearchChange,
  onSidebarToggle,
}: TopBarProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: profileResponse, isLoading, isError } =
    useGetProfileQuery();

  const profile = profileResponse?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <>
      {/* TOP BAR */}
      <div
        className="
          h-14 flex items-center gap-3 px-3
          border-b border-slate-200
          bg-gradient-to-r from-slate-50 via-white to-sky-50
          backdrop-blur
        "
      >
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Desktop Sidebar Toggle */}
        <Button
          size="icon"
          variant="outline"
          className="max-lg:hidden rounded-xl border-slate-200 bg-white hover:bg-slate-100"
          onClick={onSidebarToggle}
        >
          {isOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        {/* SEARCH */}
        <div className="relative w-full max-w-xl max-md:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search guards, sites, schedules..."
            className="
              pl-9 h-9
              border-slate-200
              bg-white/70
              focus:bg-white
              rounded-xl
            "
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-2">
          {/* REGION */}
          <div className="max-md:hidden">
            <Select defaultValue="melbourne">
              <SelectTrigger className="w-40 h-9 rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Region" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="melbourne">Melbourne</SelectItem>
                <SelectItem value="sydney">Sydney</SelectItem>
                <SelectItem value="perth">Perth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NOTIFICATIONS */}
          <NotificationModal />

          {/* PROFILE MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                </div>
              ) : (
                <UserAvatar
                  src=""
                  name={profile?.name ?? "User"}
                />
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64 rounded-xl border-slate-200"
              align="end"
            >
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
                  <p className="text-sm text-slate-500 mt-2">
                    Loading profile...
                  </p>
                </div>
              ) : isError ? (
                <div className="p-4 text-center text-red-600 text-sm">
                  Failed to load profile
                </div>
              ) : profile ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        src=""
                        name={profile.name}
                      />
                      <div>
                        <p className="text-sm font-semibold">
                          {profile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {profile.role}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setShowEditDialog(true)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PROFILE EDIT */}
      {profile && (
        <ProfileEditDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          profile={{
            name: profile.name,
            mobile: profile.mobile,
            address: profile.address,
          }}
        />
      )}
    </>
  );
}