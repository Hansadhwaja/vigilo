import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface UserAvatarProps {
    src?: string | null;
    name?: string;
    className?: string;
}

const UserAvatar = ({ src, name = "User", className }: UserAvatarProps) => {
    return (
        <Avatar
            className={cn("h-10 w-10", className)}
        >
            <AvatarImage
                src={src || ""}
                alt={name}
                className="object-cover"
            />

            <AvatarFallback
                className={cn("text-white text-sm font-bold bg-linear-to-br",
                    getAvatarColor(name)
                )}
            >
                {getInitials(name)}
            </AvatarFallback>
        </Avatar >
    );
};

export default UserAvatar;