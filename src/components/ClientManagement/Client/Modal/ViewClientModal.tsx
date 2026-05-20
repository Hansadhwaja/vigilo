import { Client } from "@/apis/usersApi";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Eye,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

const ViewClientModal = ({
    client,
}: {
    client: Client;
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="
                        rounded-xl border border-slate-200
                        text-slate-500 transition-all
                        hover:border-orange-200
                        hover:bg-orange-50
                        hover:text-orange-600
                    "
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl overflow-hidden rounded-3xl border-0 p-0">
                {/* TOP SECTION */}
                <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 px-8 py-10 text-white">
                    <div className="absolute inset-0 bg-black/5" />

                    <div className="relative flex flex-col items-center text-center">
                        <div
                            className="
                                mb-4 overflow-hidden rounded-full
                                border-4 border-white/30
                                shadow-xl
                            "
                        >
                            <img
                                src={
                                    client.avatar ||
                                    "https://ui-avatars.com/api/?name=Client"
                                }
                                alt={client.name}
                                className="h-28 w-28 object-cover"
                            />
                        </div>

                        <DialogHeader className="space-y-2">
                            <DialogTitle className="text-2xl font-bold tracking-tight">
                                {client.name}
                            </DialogTitle>

                            <DialogDescription className="text-white/80">
                                Client Information & Contact Details
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-5 p-8">
                    {/* EMAIL */}
                    <div
                        className="
                            flex items-start gap-4 rounded-2xl
                            border border-slate-200 bg-slate-50/70
                            p-4
                        "
                    >
                        <div className="rounded-xl bg-sky-100 p-3">
                            <Mail className="h-5 w-5 text-sky-600" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Email Address
                            </p>

                            <p className="font-medium text-slate-700">
                                {client.email || "Not Available"}
                            </p>
                        </div>
                    </div>

                    {/* PHONE */}
                    <div
                        className="
                            flex items-start gap-4 rounded-2xl
                            border border-slate-200 bg-slate-50/70
                            p-4
                        "
                    >
                        <div className="rounded-xl bg-emerald-100 p-3">
                            <Phone className="h-5 w-5 text-emerald-600" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Mobile Number
                            </p>

                            <p className="font-medium text-slate-700">
                                {client.mobile || "Not Available"}
                            </p>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div
                        className="
                            flex items-start gap-4 rounded-2xl
                            border border-slate-200 bg-slate-50/70
                            p-4
                        "
                    >
                        <div className="rounded-xl bg-orange-100 p-3">
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Address
                            </p>

                            <p className="leading-6 text-slate-700">
                                {client.address || "No address available"}
                            </p>
                        </div>
                    </div>

                    {/* CLIENT ID */}
                    <div
                        className="
                            flex items-start gap-4 rounded-2xl
                            border border-slate-200 bg-slate-50/70
                            p-4
                        "
                    >
                        <div className="rounded-xl bg-violet-100 p-3">
                            <User className="h-5 w-5 text-violet-600" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Client ID
                            </p>

                            <p className="font-mono text-sm text-slate-700">
                                #{client.id}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewClientModal;