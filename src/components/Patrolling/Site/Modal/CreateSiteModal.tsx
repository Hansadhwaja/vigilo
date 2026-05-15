import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react'
import SiteForm from '../Form/SiteForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreatePatrolSiteMutation } from '@/apis/patrollingAPI';
import { toast } from 'sonner';
import { SiteFormValues } from '@/schemas';

const CreateSiteModal = () => {
    const [open, setOpen] = useState(false);
    const [createPatrolSite, { isLoading }] = useCreatePatrolSiteMutation();

    const handleSubmit = async (data: SiteFormValues) => {
        try {
            await createPatrolSite({
                ...data,
                latitude: Number(data.coordinates.lat),
                longitude: Number(data.coordinates.lng)
            }).unwrap();
            toast.success("Site Created Successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while creating site")
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Site
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create New Site</DialogTitle>
                    <DialogDescription>
                        Create a major site that will contain sub-sites and checkpoints
                    </DialogDescription>
                </DialogHeader>

                <SiteForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateSiteModal