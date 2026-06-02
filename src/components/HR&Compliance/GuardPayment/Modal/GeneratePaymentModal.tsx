import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react'
import { toast } from 'sonner';
import { GuardPaymentFormValues } from '@/schemas';
import { Button } from '@/components/ui/button';
import GuardPaymentForm from '../Form/GuardPaymentForm';
import { useGenerateGuardPaymentMutation } from '@/apis/invoiceApis';

const GeneratePaymentModal = () => {
    const [open, setOpen] = useState(false);

    const [generateGuardPayment, { isLoading }] = useGenerateGuardPaymentMutation();

    const handleSubmit = async (data: GuardPaymentFormValues) => {
        console.log("Guard Payment Data", data);
        try {
            await generateGuardPayment(data).unwrap();
            toast.success(" Guard Payment Added Successfully");
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Error while Adding Guard Payment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className='cursor-pointer rounded-full bg-linear-to-r from-emerald-500 via-green-600 to-green-700'>
                    <Plus />
                    Generate Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Generate Payment
                    </DialogTitle>
                    <DialogDescription>
                        Create a new payment record for a guard based on their work hours and rates
                    </DialogDescription>
                </DialogHeader>
                <GuardPaymentForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default GeneratePaymentModal