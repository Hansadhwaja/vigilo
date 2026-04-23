import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { MessageItem } from "@/apis/messagesAPI";

interface MessageMenuProps {
    isMine: boolean;
    message: MessageItem;
    onEdit: (msg: MessageItem) => void;
    onDeleteForEveryone: (id: string) => void;
    onDeleteForMe: (id: string) => void;
}

const MessageMenu = ({
    isMine,
    message,
    onEdit,
    onDeleteForEveryone,
    onDeleteForMe,
}: MessageMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="h-5 w-5 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-600 transition cursor-pointer">
                <ChevronDown size={16} strokeWidth={2.5} />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={isMine ? "end" : "start"}
                className="w-48 rounded-md"
            >
                {isMine ? (
                    <>
                        <DropdownMenuItem
                            onClick={() => onEdit(message)}
                            className="cursor-pointer flex items-center gap-2"
                        >
                            <Pencil size={14} />
                            Edit message
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={() => onDeleteForEveryone(message.id)}
                            className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-600"
                        >
                            <Trash2 size={14} className="text-red-600 hover:text-red-600" />
                            Delete for everyone
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem
                        onClick={() => onDeleteForMe(message.id)}
                        className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-600"
                    >
                        <Trash2 size={14} className="text-red-600 hover:text-red-600" />
                        Delete for me
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MessageMenu;