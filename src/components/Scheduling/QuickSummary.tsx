import { OrganizedAssignment } from '@/types'
import { Calendar, Clock, User } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import ShiftPill from './ShiftPill'
import StatCards from '../common/StatCard/StatCards';
import { Separator } from '../ui/separator';

interface QuickSummaryProps {
    selectedDate: Date;
    assignments: OrganizedAssignment[];
}

const QuickSummary = ({
    selectedDate,
    assignments
}: QuickSummaryProps) => {

    const stats = [
        {
            label: "Total",
            Icon: User,
            value: assignments.length,
            color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
            label: "Active",
            Icon: Clock,
            value: assignments.filter((a: OrganizedAssignment) => a.status === "active").length,
            color: "bg-green-50 text-green-700 border-green-200"
        },
    ];
    return (
        <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 p-0">
            <CardContent className="p-4 space-y-4">

                <div className="flex max-sm:flex-col justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                                {selectedDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {selectedDate.getFullYear()}
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-end flex-1'>
                        <StatCards items={stats} />
                    </div>

                </div>
                <Separator />

                {assignments.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {assignments.slice(0, 4).map((a: OrganizedAssignment) => (
                            <ShiftPill key={a.id} assignment={a} />
                        ))}

                        {assignments.length > 4 && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border-2 border-dashed border-gray-300 text-gray-600">
                                <span className="font-semibold">
                                    +{assignments.length - 4}
                                </span>
                                <span>more assignments</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-500">
                            No assignments scheduled for this date
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default QuickSummary