import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils';

interface SummaryCardProps {
    title: string;
    value: string;
    className?: string;
}

const SummaryCard = ({ title, value, className }: SummaryCardProps) => {
    return (

        <Card className='p-2 flex flex-col gap-1 rounded-sm'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-xl font-bold",
                    className
                )}>{value}</div>
            </CardContent>
        </Card>
    )
}

export default SummaryCard