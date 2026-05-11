import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus } from 'lucide-react';
import { useState } from 'react'
import { toast } from 'sonner';
import { TimeSheetFormValues } from '@/schemas';
import { Button } from '@/components/ui/button';
import { TimeSheet } from '@/types';
import TimeSheetForm from '../Form/TimeSheetForm';

const GeneratePaymentModal = () => {
    const [open, setOpen] = useState(false);

    const handleSubmit = async (data: TimeSheetFormValues) => {
        console.log("Edit Time Sheet Data", data);
        try {
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
                <Button size="sm" className='cursor-pointer'>
                    <Plus />
                    Generate Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Edit Time Sheet
                    </DialogTitle>
                    <DialogDescription>
                        Modify shift times if corrections are needed
                    </DialogDescription>
                </DialogHeader>
                <TimeSheetForm
                    
                    onSubmit={handleSubmit}
                    isLoading={false}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default GeneratePaymentModal