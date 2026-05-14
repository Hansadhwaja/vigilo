import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react'
import SiteForm from '../Form/SiteForm';

const CreateSiteModal = () => {
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create New Site</DialogTitle>
                    <DialogDescription>
                        Create a major site that will contain sub-sites and checkpoints
                    </DialogDescription>
                </DialogHeader>

                <SiteForm />
            </DialogContent>
        </Dialog>
    )
}

export default CreateSiteModal