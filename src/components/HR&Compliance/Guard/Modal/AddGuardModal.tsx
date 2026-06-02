import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, User } from 'lucide-react';
import React, { useState } from 'react'
import GuardForm from '../Form/GuardForm';
import { toast } from 'sonner';
import { GuardFormValues } from '@/schemas';
import { useCreateGuardByAdminMutation } from '@/apis/guardsApi';
import { Button } from '@/components/ui/button';

const AddGuardModal = () => {
    const [open, setOpen] = useState(false);

    const [createGuard, { isLoading }] = useCreateGuardByAdminMutation();

    const handleSubmit = async (data: GuardFormValues) => {
        try {
            await createGuard(data).unwrap();
            toast.success("Guard added Successfully");
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Error while Adding Guard");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='cursor-pointer rounded-full bg-linear-to-r from-orange-500 via-orange-600 to-orange-700'>
                    <Plus />
                    Add Guard
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Add New Guard
                    </DialogTitle>
                    <DialogDescription>
                        Fill in all required fields to add a new guard
                    </DialogDescription>
                </DialogHeader>
                <GuardForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddGuardModal