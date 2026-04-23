import React, { useState } from "react";
import { Search, Menu, Globe, User, LogOut, Settings, Edit, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGetProfileQuery } from "../../apis/profileApi";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { toast } from "sonner";
import MobileSidebar from "./Navbar/MobileSidebar";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSidebarToggle: () => void;
  liveRevenue: number;
}

export default function TopBar({ search, onSearchChange, onSidebarToggle, liveRevenue }: TopBarProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch profile from API
  const { data: profileResponse, isLoading, isError } = useGetProfileQuery();

  const profile = profileResponse?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className="h-14 border-b bg-white flex items-center gap-2 px-3">
        <MobileSidebar liveRevenue={liveRevenue} />
        <Button size="icon" variant="ghost" className="max-md:hidden" onClick={onSidebarToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="w-full max-w-xl relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search sites, guards, incidents…"
            className="pl-8"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select defaultValue="melbourne">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="melbourne">Melbourne</SelectItem>
              <SelectItem value="sydney">Sydney</SelectItem>
              <SelectItem value="perth">Perth</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            Client Portal
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                {isLoading ? (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-400 transition">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {profile ? getInitials(profile.name) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading profile...</p>
                </div>
              ) : isError ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-red-600">Failed to load profile</p>
                </div>
              ) : profile ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold leading-none">{profile.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-2 space-y-1">
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <span className="truncate">{profile.email}</span>
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Mobile:</span>
                          <span>{profile.mobile}</span>
                        </p>
                        <p className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="font-medium flex-shrink-0">Address:</span>
                          <span className="line-clamp-2">{profile.address}</span>
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Edit Dialog */}
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
