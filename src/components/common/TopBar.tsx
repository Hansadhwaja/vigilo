import { Search, CreditCard } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationModal from "../Notification/Modal/NotificationModal";
import IconInput from "./Input/IconInput";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import ProfileMenu from "../Profile/ProfileMenu";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function TopBar({ search, onSearchChange }: TopBarProps) {
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
          <ProfileMenu />
        </div>
      </header>
    </>
  );
}
