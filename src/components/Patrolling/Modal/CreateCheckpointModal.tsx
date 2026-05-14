import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react'
import CheckpointForm from '../Form/CheckpointForm';

const CreateCheckpointModal = () => {
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Checkpoint</DialogTitle>
                    <DialogDescription>
                        Add a checkpoint to with GPS coordinates and QR code
                    </DialogDescription>
                </DialogHeader>

                <CheckpointForm
                    onSubmit={handleSubmit}
                    isLoading={false}
                    onCancel={() => setOpen(false)}
                />


            </DialogContent>
        </Dialog>
    )
}

export default CreateCheckpointModal