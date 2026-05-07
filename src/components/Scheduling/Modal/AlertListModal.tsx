import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { upcomingReminders } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useState } from "react";

const AlertListModal = () => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                >
                    <Bell />
                    Alerts ({upcomingReminders.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Alerts & Reminders</DialogTitle>
                    <DialogDescription>
                        Upcoming assignments and notifications
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {upcomingReminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border"
                        >
                            <Bell className="h-5 w-5 text-blue-600" />
                            <div className="flex-1">
                                <div className="font-medium">{reminder.message}</div>
                                <div className="text-lg text-gray-600">
                                    {reminder.assignee} • {formatDateTime(reminder.time).time}{" "}
                                    on {formatDateTime(reminder.time).date}
                                </div>
                            </div>
                            <Badge variant="outline">{reminder.type}</Badge>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AlertListModal