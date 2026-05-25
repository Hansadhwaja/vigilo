import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { BroadCastFormValues, broadcastSchema } from "@/schemas";
import { Send } from "lucide-react";

const BroadCastMessageForm = ({
    onSubmit,
}: {
    onSubmit: (data: BroadCastFormValues) => void;
}) => {
    const form = useForm<BroadCastFormValues>({
        resolver: zodResolver(broadcastSchema),
        mode: "onChange",
        defaultValues: {
            sendToAll: true,
            guardIds: [],
            projectId: "",
            message: "",
        },
    });

    const onFormSubmit = async (data: BroadCastFormValues) => {
        await onSubmit(data);
        form.reset();
    };

    return (
        <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-4 py-4"
        >
            <Controller
                control={form.control}
                name="sendToAll"
                render={() => (
                    <Field>
                        <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2">
                            <Checkbox checked disabled />
                            <span className="text-sm font-medium text-green-700">
                                Sending to all guards
                            </span>
                        </div>
                    </Field>
                )}
            />

            <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Message</FieldLabel>

                        <Textarea
                            placeholder="Write your announcement..."
                            className="min-h-32 resize-none rounded-xl"
                            {...field}
                        />

                        {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button
                type="submit"
                className="w-full rounded-xl bg-green-500 hover:bg-green-600"
            >
                <Send className="mr-2 h-4 w-4" />
                Send Broadcast
            </Button>
        </form>
    );
};

export default BroadCastMessageForm;