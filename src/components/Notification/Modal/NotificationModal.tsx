import {
    useDeleteAllNotificationsMutation,
    useDeleteNotificationByIdMutation,
    useGetMyNotificationsQuery,
    useMarkAllNotificationsAsReadMutation,
} from "@/apis/notificationAPI";

import DeleteModal from "@/components/common/Modal/DeleteModal";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Bell,
    CheckCheck,
    Clock3,
    Trash2,
} from "lucide-react";

import { toast } from "sonner";

const NotificationModal = () => {
    const { data: notificationsResponse } = useGetMyNotificationsQuery({
        page: 1,
        limit: 20,
        filter: "all",
    });

    const notifications = notificationsResponse?.data || [];

    const unreadCount =
        notificationsResponse?.counts?.unread ?? 0;

    const [markAllNotificationsAsRead, { isLoading: isMarkingAllRead }] =
        useMarkAllNotificationsAsReadMutation();

    const [deleteAllNotifications, { isLoading: isDeletingAll }] =
        useDeleteAllNotificationsMutation();

    const [deleteNotificationById, { isLoading: isDeleting }] =
        useDeleteNotificationByIdMutation();

    const handleDeleteNotification = async (notificationId: string) => {
        try {
            await deleteNotificationById(notificationId).unwrap();

            toast.success("Notification deleted");
        } catch (err: any) {
            toast.error(
                err?.data?.message ||
                err?.error ||
                "Failed to delete notification"
            );
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            await deleteAllNotifications({
                filter: "all",
            }).unwrap();

            toast.success("All notifications deleted");
        } catch (err: any) {
            toast.error(
                err?.data?.message ||
                err?.error ||
                "Failed to delete notifications"
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead({
                filter: "all",
            }).unwrap();

            toast.success("All notifications marked as read");
        } catch (err: any) {
            toast.error(
                err?.data?.message ||
                err?.error ||
                "Failed to mark notifications as read"
            );
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />

                    {unreadCount > 0 && (
                        <div className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                            {unreadCount}
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[380px] rounded-2xl border border-slate-200 p-0 shadow-xl"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            Notifications
                        </h2>

                        <p className="text-xs text-slate-500">
                            {unreadCount} unread
                        </p>
                    </div>

                    {notifications.length > 0 && (
                        <div className="flex items-center gap-1">

                            <Button
                                size="icon-sm"
                                variant="ghost"
                                className="text-slate-600 hover:bg-slate-100"
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAllRead}
                            >
                                <CheckCheck className="h-4 w-4" />
                            </Button>

                            <DeleteModal
                                title="notifications"
                                description="This will permanently delete all notifications."
                                onConfirm={handleDeleteAllNotifications}
                                isLoading={isDeletingAll}
                            />
                        </div>
                    )}
                </div>

                {/* BODY */}
                <div className="max-h-100 overflow-y-auto p-2 no-scrollbar">
                    {notifications.length > 0 ? (
                        <div className="space-y-2">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group rounded-xl border p-3 transition-all hover:bg-slate-50 ${notification.isRead
                                        ? "border-slate-200 bg-white"
                                        : "border-orange-200 bg-orange-50/60"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">

                                        {/* LEFT */}
                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start gap-2">

                                                {!notification.isRead && (
                                                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                                                )}

                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {notification.message}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">

                                                        <span className="capitalize">
                                                            {notification.type}
                                                        </span>

                                                        <span>•</span>

                                                        <div className="flex items-center gap-1">
                                                            <Clock3 className="h-3 w-3" />

                                                            <span>
                                                                {new Date(
                                                                    notification.createdAt
                                                                ).toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DELETE */}
                                        <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                            <DeleteModal
                                                title="notification"
                                                onConfirm={() =>
                                                    handleDeleteNotification(
                                                        notification.id
                                                    )
                                                }
                                                isLoading={isDeleting}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                <Bell className="h-6 w-6 text-slate-400" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                                No notifications
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                You&apos;re all caught up.
                            </p>
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationModal;