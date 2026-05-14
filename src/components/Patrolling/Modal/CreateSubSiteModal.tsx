import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react'
import SubSiteForm from '../Form/SubSiteForm';

const CreateSubSiteModal = () => {
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Sub-Site</DialogTitle>
                    <DialogDescription>
                        Add a sub-site to with pricing and checkpoint capacity
                    </DialogDescription>
                </DialogHeader>

                <SubSiteForm
                    onSubmit={handleSubmit}
                    isLoading={false}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateSubSiteModal