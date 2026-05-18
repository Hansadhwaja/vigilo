import { useState } from "react";
import { Search, LogOut, Edit, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function TopBar({ isOpen, search, onSearchChange, onSidebarToggle }: TopBarProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch profile from API
  const { data: profileResponse, isLoading, isError } = useGetProfileQuery();

  const profile = profileResponse?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="h-14 border-b bg-white flex items-center gap-2 px-3">
        <MobileSidebar />
        <Button size="icon" variant="outline" className="max-lg:hidden" onClick={onSidebarToggle}>
          {isOpen ? (
            <PanelLeftClose />
          ) : (
            <PanelLeftOpen />
          )}
        </Button>
        <div className="w-full max-w-xl relative max-md:hidden">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search sites, guards, incidents…"
            className="pl-8"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1 max-md:hidden">
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
          </div>

          <NotificationModal />
          

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              ) : (
                <UserAvatar
                  src={""}
                  name={profile?.name ?? "User"}
                />
              )}

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
                        <UserAvatar
                          src={""}
                          name={profile?.name ?? "User"}
                        />
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
                          <span className="font-medium shrink-0">Address:</span>
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
