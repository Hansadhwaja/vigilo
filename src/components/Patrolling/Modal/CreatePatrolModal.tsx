import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react'
import PatrolForm from '../Form/PatrolForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CreatePatrolModal = () => {
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {

    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
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
                    isLoading={false}
                    onCancel={() => setOpen(false)}

                />

            </DialogContent>
        </Dialog>
    )
}

export default CreatePatrolModal