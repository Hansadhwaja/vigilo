import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { AlarmFormValues, ServicePricingFormValues } from "@/schemas";
import { useCreateAlarmMutation } from "@/apis/alarmsAPI";
import { toast } from "sonner";
import ServicePricingForm from "../../Form/ServicePricingForm";
import { useDispatch } from "react-redux";
import { setServicePricing } from "@/apis/slices/servicePricingSlice";
import { useState } from "react";

const EditServicePricingModal = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (data: ServicePricingFormValues) => {
        try {
            dispatch(setServicePricing(data));
            setOpen(false);
            toast.success("Service Price Edited Successfully");
        } catch (error) {
            toast.error("Error while Editing Service Price.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Service Pricing
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Edit Service Pricing
                    </DialogTitle>
                    <DialogDescription>
                        Select a service to configure pricing
                    </DialogDescription>
                    <ServicePricingForm
                        onSubmit={handleSubmit}
                        isLoading={false}
                    />
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}

export default EditServicePricingModal