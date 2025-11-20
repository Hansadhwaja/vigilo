import React from "react";
import { Search, Menu, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSidebarToggle: () => void;
}

export default function TopBar({ search, onSearchChange, onSidebarToggle }: TopBarProps) {
  return (
    <div className="h-14 border-b bg-white flex items-center gap-2 px-3">
      <Button size="icon" variant="ghost" className="md:hidden" onClick={onSidebarToggle}>
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
          <Globe className="h-4 w-4"/> 
          Client Portal
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>FM</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}