import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { BroadCastFormValues, broadcastSchema } from "@/schemas";


const BroadCastMessageForm = ({
    onSubmit,

}: {
    onSubmit: (data: BroadCastFormValues) => void,
}) => {
    // const { data, isLoading } = useGetAllGuardsQuery();

    // const guards = data?.data ?? [];

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

    // const sendToAll = form.watch("sendToAll");

    const onFormSubmit = async (data: BroadCastFormValues) => {
        await onSubmit(data);
        form.reset();

    };

    return (
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-2 py-4">

            {/* Send To All */}
            <Controller
                control={form.control}
                name="sendToAll"
                render={({ field }) => (
                    <Field>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-sm">
                            <Checkbox
                                checked
                                disabled
                            />
                            <span>Send to all guards</span>
                        </div>
                    </Field>
                )}
            />

            {/* Select Recipients */}
            {/* {!sendToAll && (
                <Controller
                    control={form.control}
                    name="guardIds"
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Select Recipients</FieldLabel>

                            {isLoading ? <Loader /> : (<div className="space-y-2 border rounded-md p-3 h-40 overflow-y-auto">

                                {guards?.map((guard) => {
                                    const isChecked = field.value?.includes(guard.id);

                                    return (
                                        <div
                                            key={guard.id}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([
                                                            ...(field.value || []),
                                                            guard.id,
                                                        ]);
                                                    } else {
                                                        field.onChange(
                                                            field.value?.filter(
                                                                (id) => id !== guard.id
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <span>{guard.name}</span>
                                        </div>
                                    );
                                })}

                            </div>)}

                            {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            )} */}

            {/* Project */}
            <Controller
                control={form.control}
                name="projectId"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Project (Optional)</FieldLabel>

                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="p1">Project 1</SelectItem>
                                <SelectItem value="p2">Project 2</SelectItem>
                            </SelectContent>
                        </Select>

                        {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* Message */}
            <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Message</FieldLabel>

                        <Textarea placeholder="Enter message..." {...field} />

                        {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* Attachment */}
            <Controller
                control={form.control}
                name="attachment"
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Attachment</FieldLabel>

                        <Input
                            type="file"
                            onChange={(e) =>
                                field.onChange(e.target.files?.[0])
                            }
                        />

                        {fieldState.error && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Send Broadcast</Button>
        </form>
    );
};

export default BroadCastMessageForm;