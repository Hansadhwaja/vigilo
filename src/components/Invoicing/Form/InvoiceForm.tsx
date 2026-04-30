"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { InvoiceFormValues, invoiceSchema } from "@/schemas";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import { Client } from "@/apis/usersApi";
import ServicePricingSection from "../New/ServicePricingSection";
import SyncedOrdersForm from "./SyncedOrdersForm";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResolvedAlarmsForm from "./ResolvedAlarmsForm";
import InvoicePreview from "../New/InvoicePreview";
import { useGetAllOrdersQuery } from "@/apis/ordersApi";
import { useGetAllAlarmsQuery } from "@/apis/alarmsAPI";

interface InvoiceFormProps {
    isLoading: boolean;
    onSubmit: (data: InvoiceFormValues) => void;
    clients: Client[];
}

const InvoiceForm = ({
    isLoading,
    onSubmit,
    clients,
}: InvoiceFormProps) => {
    const { data } = useGetAllOrdersQuery();
    const orders = data?.data ?? [];

    const { data: alarmsResponse } = useGetAllAlarmsQuery();
    const alarms = alarmsResponse?.data ?? [];


    const form = useForm({
        resolver: zodResolver(invoiceSchema),
        mode: "onChange",
        defaultValues: {
            clientId: "",
            billingFrom: "",
            billingTo: "",
            invoiceDate: "",
            dueDate: "",
            notes: "",
            orders: [],
            alarms: [],
            services: [],
        },
    });

    const { handleSubmit, formState: { isValid } } = form;

    const onFormSubmit = async (data: InvoiceFormValues) => {
        await onSubmit(data);
        form.reset();
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 flex-1 min-h-0">
                <ScrollArea className="flex-1 min-h-0 pr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-4 col-span-2">
                            <InvoiceDetailsForm clients={clients} />
                            <ServicePricingSection />
                            <SyncedOrdersForm orders={orders} />
                            <ResolvedAlarmsForm alarms={alarms} />
                        </div>
                        <InvoicePreview
                            clients={clients}
                        />
                    </div>
                </ScrollArea>

                <Separator />
                <div className="flex justify-end gap-2 bg-background sticky bottom-0">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={!isValid || isLoading}
                        className="flex items-center gap-2 px-5"
                    >
                        {isLoading ? <Loader /> : "Create Invoice"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default InvoiceForm;