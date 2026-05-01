import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search } from "lucide-react";
import { Button } from "../ui/button";

const SearchFilters = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="sm:col-span-2 lg:col-span-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search invoices, clients, or IDs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="lg:col-span-3">
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="outstanding">Outstanding</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="lg:col-span-3">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="01-26">Jan 2026</SelectItem>
                        <SelectItem value="02-26">Feb 2026</SelectItem>
                        <SelectItem value="03-26">Mar 2026</SelectItem>
                        <SelectItem value="04-26">Apr 2026</SelectItem>
                        <SelectItem value="05-26">May 2026</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="lg:col-span-2">
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>

        </div>
    );
};

export default SearchFilters