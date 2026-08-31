import { useState } from "react";
import { Search, Edit, Loader2, LogOut, CreditCard } from "lucide-react";

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
import { SidebarTrigger } from "@/components/ui/sidebar";

import { useGetProfileQuery } from "@/store/apis/profileApi";
import UserAvatar from "./Avatar/UserAvatar";
import NotificationModal from "../Notification/Modal/NotificationModal";
import LogoutModal from "@/components/Auth/Modal/LogoutModal";
import IconInput from "./Input/IconInput";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import EditProfileModal from "../Profile/Modal/EditProfileModal";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function TopBar({ search, onSearchChange }: TopBarProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: profileResponse, isLoading, isError } = useGetProfileQuery();

  const profile = profileResponse?.data;

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b bg-background/95 px-3 backdrop-blur">
        <SidebarTrigger className="rounded-xl border bg-background hover:bg-accent" />

        <IconInput
          Icon={Search}
          value={search}
          onChange={onSearchChange}
          placeholder="Search guards, sites, schedules..."
          className="h-9 rounded-xl bg-background border lg:w-sm"
        />

        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link to="plan">
              <CreditCard />
              Plans
            </Link>
          </Button>

          <NotificationModal />

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              {isLoading ? (
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                </div>
              ) : (
                <UserAvatar src="" name={profile?.name ?? "User"} />
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 rounded-xl" align="end">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="text-muted-foreground mx-auto h-5 w-5 animate-spin" />

                  <p className="text-muted-foreground mt-2 text-sm">
                    Loading profile...
                  </p>
                </div>
              ) : isError ? (
                <div className="text-destructive p-4 text-center text-sm">
                  Failed to load profile
                </div>
              ) : profile ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <UserAvatar src="" name={profile.name} />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {profile.name}
                        </p>

                        <p className="text-muted-foreground truncate text-sm">
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
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <LogoutModal>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </LogoutModal>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {profile && (
        <EditProfileModal
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
