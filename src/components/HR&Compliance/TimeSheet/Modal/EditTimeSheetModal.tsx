import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Edit } from 'lucide-react';
import { useState } from 'react'
import { toast } from 'sonner';
import { TimeSheetFormValues } from '@/schemas';
import { Button } from '@/components/ui/button';
import { TimeSheet } from '@/types';
import TimeSheetForm from '../Form/TimeSheetForm';
import { useEditTimeSheetMutation } from '@/apis/schedulingAPI';
import { combineDateAnd12HourTime } from '@/lib/utils';

const EditTimeSheetModal = ({ timeSheet }: { timeSheet: TimeSheet }) => {
    const [open, setOpen] = useState(false);

    const [editTimeSheet, { isLoading }] = useEditTimeSheetMutation();

    const handleSubmit = async (data: TimeSheetFormValues) => {
        console.log("Edit Time Sheet Data", data);
        try {
            const payload = {
                startTime: combineDateAnd12HourTime(
                    timeSheet.date,
                    data.shiftStartTime
                ),

                endTime: combineDateAnd12HourTime(
                    timeSheet.date,
                    data.shiftEndTime
                ),
            };

            await editTimeSheet({
                id: timeSheet.shiftId,
                data: payload
            }).unwrap();
            toast.success("Time Sheet Edited Successfully");
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Error while Editing Time Sheet");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className='cursor-pointer'>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Edit Time Sheet-{timeSheet.date}
                    </DialogTitle>
                    <DialogDescription>
                        Modify shift times if corrections are needed
                    </DialogDescription>
                </DialogHeader>
                <TimeSheetForm
                    initialData={timeSheet}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditTimeSheetModal