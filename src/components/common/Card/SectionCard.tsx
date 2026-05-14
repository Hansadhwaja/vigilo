import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

const SectionCard = ({
    title,
    icon,
    children,
}: SectionCardProps) => {
    return (
        <Card
            className="
        border-0
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        rounded-2xl
        bg-white/90
        backdrop-blur
        overflow-hidden
      "
        >
            <CardHeader
                className="
          border-b
          bg-gradient-to-r
          from-slate-50
          to-gray-50
          pb-4
        "
            >
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {icon}
                    </div>

                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                {children}
            </CardContent>
        </Card>
    );
};

export default SectionCard;