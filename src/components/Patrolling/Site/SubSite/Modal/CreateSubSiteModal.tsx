import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react'
import SubSiteForm from '../Form/SubSiteForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateSubSiteMutation } from '@/apis/patrollingAPI';
import { SubSiteFormValues } from '@/schemas';
import { toast } from 'sonner';

const CreateSubSiteModal = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);
    const [createSubSite, { isLoading }] = useCreateSubSiteMutation();

    const handleSubmit = async (data: SubSiteFormValues) => {
        try {
            await createSubSite({
                ...data,
                siteId: id
            }).unwrap();
            toast.success("Sub Site Created Successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Error while creating sub site")
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Sub-Site
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Sub-Site</DialogTitle>
                    <DialogDescription>
                        Add a sub-site to with pricing and checkpoint capacity
                    </DialogDescription>
                </DialogHeader>

                <SubSiteForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CreateSubSiteModal