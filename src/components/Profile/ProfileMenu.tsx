import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProfileQuery } from "@/store/apis/profileApi";
import { Edit, Loader2, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import UserAvatar from "../common/Avatar/UserAvatar";
import LogoutModal from "../Auth/Modal/LogoutModal";
import EditProfileModal from "./Modal/EditProfileModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfileMenu = () => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: profileResponse, isLoading, isError } = useGetProfileQuery();

  const profile = profileResponse?.data;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="focus-visible:ring-ring flex h-9 w-9 cursor-pointer items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {isLoading ? (
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-full">
                <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              </div>
            ) : (
              <UserAvatar
                src={profile?.avatar ?? ""}
                name={profile?.name ?? "User"}
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 overflow-hidden rounded-2xl p-0 shadow-lg"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center px-4 py-8">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>

              <p className="text-muted-foreground mt-3 text-sm">
                Loading profile...
              </p>
            </div>
          ) : isError ? (
            <div className="px-4 py-8 text-center">
              <div className="bg-destructive/10 mx-auto flex h-10 w-10 items-center justify-center rounded-full">
                <UserRound className="text-destructive h-5 w-5" />
              </div>

              <p className="text-destructive mt-3 text-sm font-medium">
                Failed to load profile
              </p>

              <p className="text-muted-foreground mt-1 text-xs">
                Please try again later.
              </p>
            </div>
          ) : profile ? (
            <>
              {/* Profile Header */}
              <div className="bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar src={profile.avatar ?? ""} name={profile.name} />

                  <div className="min-w-0 flex-1">
                    <Tooltip>
                      <TooltipTrigger className="truncate text-sm font-semibold">
                        {profile.name}
                      </TooltipTrigger>
                      <TooltipContent>{profile.name}</TooltipContent>
                    </Tooltip>

                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className="m-0" />

              {/* Account Actions */}
              <div className="p-1.5">
                <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider">
                  Account
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => setShowEditDialog(true)}
                  className="cursor-pointer rounded-lg px-3 py-2.5"
                >
                  <div className="bg-muted mr-3 flex h-8 w-8 items-center justify-center rounded-lg">
                    <Edit className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Edit Profile</p>
                    <p className="text-muted-foreground text-xs">
                      Update your personal information
                    </p>
                  </div>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="m-0" />

              {/* Logout */}
              <div className="p-1.5">
                <LogoutModal>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg px-3 py-2.5"
                  >
                    <div className="bg-destructive/10 mr-3 flex h-8 w-8 items-center justify-center rounded-lg">
                      <LogOut className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">Logout</p>
                      <p className="text-destructive/70 text-xs">
                        Sign out of your account
                      </p>
                    </div>
                  </DropdownMenuItem>
                </LogoutModal>
              </div>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

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
    </div>
  );
};

export default ProfileMenu;
