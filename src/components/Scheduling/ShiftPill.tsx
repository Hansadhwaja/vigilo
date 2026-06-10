import EditAssignmentModal from './Modal/EditAssignmentModal'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrganizedAssignment } from '@/types'
import { Card, CardContent } from '@/components/ui/card'

const ShiftPill = ({ assignment }: { assignment: OrganizedAssignment }) => {
    return (
        <Card className='p-0'>
            <CardContent
                className={cn("group relative inline-flex items-center gap-2 p-4 rounded-lg text-sm font-medium  cursor-pointer transition-all shadow-sm",
                    assignment.type === "patrol"
                        ? "bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-300"
                        : "bg-green-100 text-green-900 hover:bg-green-200 border border-green-300"
                )}
            >

                <div className="p-1 rounded bg-white/50">
                    <User className="h-3 w-3" />
                </div>


                <div className="flex flex-col leading-tight">
                    <span className="font-semibold truncate max-w-30">
                        {assignment.guardName}
                    </span>

                    <span className="text-sm opacity-70 truncate max-w-35">
                        {assignment.start} - {assignment.end}
                    </span>
                </div>
                <div className="absolute top-1 right-1 lg:opacity-0 group-hover:opacity-100 transition">
                    <EditAssignmentModal id={assignment.shiftId} assignment={assignment} />
                </div>
            </CardContent>
        </Card>
    )
}

export default ShiftPill