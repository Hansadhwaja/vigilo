import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AlarmForm from "../Form/AlarmForm";
import { AlarmFormValues } from "@/schemas";
import { useCreateAlarmMutation } from "@/apis/alarmsAPI";
import { toast } from "sonner";

const CreateAlarmModal = () => {
    const [createAlarm, { isLoading }] = useCreateAlarmMutation();

    const handleSubmit = async (data: AlarmFormValues) => {
        try {

            const payload = {
                title: data.title,
                alarmType: data.type,
                priority: data.priority,
                siteId: data.siteId,
                specificLocation: data.location,
                guardIds: data.guardIds,
                etaMinutes: Number(data.eta) ?? 0,
                slaTimeMinutes: Number(data.slaTime),
                unitPrice: Number(data.unitPrice),
                price: Number(data.unitPrice),
                description: data.description ?? "",
                monitoringCompany: data.monitoringCompany,
                license: data.license,

            };

            await createAlarm(payload).unwrap();

            toast.success("Alarm created successfully");

        } catch (err: any) {
            console.error(err);

            const message =
                err?.data?.message ||
                err?.error ||
                "Failed to create alarm";

            toast.error(message);
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Alarm
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Create New Alarm
                    </DialogTitle>
                    <DialogDescription>
                        Register a new security alarm and assign response parameters
                    </DialogDescription>
                </DialogHeader>

                <AlarmForm
                    isLoading={isLoading}
                    onSubmit={handleSubmit}
                />

            </DialogContent>
        </Dialog>
    )
}

export default CreateAlarmModal