import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    others?: React.ReactNode;
    description?: string;
}

const SectionCard = ({
    title,
    description,
    icon,
    children,
    others
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
        overflow-hidden p-0
      "
        >
            <CardHeader
                className="
          border-b
          bg-linear-to-r
          from-slate-50
          to-gray-50
          p-4
        "
            >
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                {icon}
                            </div>

                            {title}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {others && (
                        others
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {children}
            </CardContent>
        </Card>
    );
};

export default SectionCard;