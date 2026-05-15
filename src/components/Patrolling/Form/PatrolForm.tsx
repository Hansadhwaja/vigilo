import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
    patrolSchema,
    PatrolFormValues,
} from "@/schemas";
import PatrolBasicInfoSection from "./PatrolBasicInfoSection";
import PatrolSiteSelectionSection from "./PatrolSiteSelectionSection";

interface PatrolFormProps {
    isLoading: boolean;
    onSubmit: (
        data: PatrolFormValues
    ) => Promise<void> | void;
    onCancel: () => void;
    initialData?: PatrolFormValues;
}

const PatrolForm = ({
    isLoading,
    onCancel,
    onSubmit,
    initialData,
}: PatrolFormProps) => {

    const form = useForm<PatrolFormValues>({
        resolver: zodResolver(patrolSchema),
        mode: "onChange",
        defaultValues: initialData || {
            patrolName: "",
            guardIds: [],
            vehicleIds: [],
            orderId: "",
            siteIds: [],
            startDateTime: "",
            estimatedCompletion: "",
            unitPrice: 0,
            notes: "",
        },
    });

    const {
        handleSubmit,
        reset,
        formState: { isValid },
    } = form;

    const onFormSubmit = async (
        data: PatrolFormValues
    ) => {
        await onSubmit(data);

        if (!initialData) {
            reset();
        }
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-6"
            >
                <PatrolBasicInfoSection />
                <PatrolSiteSelectionSection />

                <div className="flex justify-end gap-3 pt-2">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? (
                            <Loader className="h-4 w-4" />
                        ) : (
                            "Create Patrol"
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default PatrolForm;