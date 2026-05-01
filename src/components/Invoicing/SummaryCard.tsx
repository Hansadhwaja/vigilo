import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils';

interface SummaryCardProps {
    title: string;
    value: string;
    className?: string;
}

const SummaryCard = ({ title, value, className }: SummaryCardProps) => {
    return (
        <Card className='p-0 rounded-sm'>
            <CardContent className='p-2'>
                <CardHeader className='px-0'>
                    <CardTitle className="description font-medium text-left">{title}</CardTitle>
                </CardHeader>
                <div className={cn("text-base md:text-lg font-bold",
                    className
                )}>{value}</div>
            </CardContent>
        </Card>
    )
}

export default SummaryCard