import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react'
import CheckpointForm from '../Form/CheckpointForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateCheckpointMutation } from '@/apis/patrollingAPI';
import { toast } from 'sonner';
import { CheckpointFormValues } from '@/schemas';

const CreateCheckpointModal = ({ siteId, subSiteId }: { siteId: string, subSiteId: string }) => {
    const [open, setOpen] = useState(false);
    const [createCheckpoint, { isLoading }] = useCreateCheckpointMutation();

    const handleSubmit = async (data: CheckpointFormValues) => {
        try {
            await createCheckpoint({
                ...data,
                siteId,
                subSiteId,
                latitude: data.checkpointLat,
                longitude: data.checkpointLng,
                verificationRange: data.range,
                priorityLevel: data.priority,
                description: data.checkpointDescription
            }).unwrap();
            toast.success("Checkpoint Created Successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while creating checkpoint")
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-blue-600"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Checkpoint
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Checkpoint</DialogTitle>
                    <DialogDescription>
                        Add a checkpoint to with GPS coordinates and QR code
                    </DialogDescription>
                </DialogHeader>

                <CheckpointForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />


            </DialogContent>
        </Dialog>
    )
}

export default CreateCheckpointModal