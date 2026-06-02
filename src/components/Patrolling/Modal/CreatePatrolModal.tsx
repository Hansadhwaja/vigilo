import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react'
import PatrolForm from '../Form/PatrolForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreatePatrolRunMutation } from '@/apis/patrollingAPI';
import { PatrolFormValues } from '@/schemas';
import { toast } from 'sonner';

const CreatePatrolModal = () => {
    const [open, setOpen] = useState(false);
    const [createPatrolRun, { isLoading }] = useCreatePatrolRunMutation();

    const handleSubmit = async (data: PatrolFormValues) => {
        try {
            await createPatrolRun({
                ...data,
                patrolId: crypto.randomUUID()
            }).unwrap();
            toast.success("Patrol Created Successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while creating patrol")
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button className="rounded-full bg-linear-to-r from-indigo-500 via-violet-600 to-indigo-700">
                    <Plus />
                    Create Patrol
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-8 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Patrol Run</DialogTitle>
                    <DialogDescription>
                        Set up comprehensive patrol with sites, sub-sites, and checkpoints
                    </DialogDescription>
                </DialogHeader>

                <PatrolForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />

            </DialogContent>
        </Dialog>
    )
}

export default CreatePatrolModal