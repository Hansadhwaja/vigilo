import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Client } from '@/apis/usersApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const InvoiceDetailsForm = ({ clients }: { clients: Client[] }) => {
    const { control } = useFormContext();

    return (
        <Card className='p-0'>
            <CardContent className='p-4 space-y-4 bg-gray-100'>
                <CardHeader className="sub-heading px-0">Invoice Details</CardHeader>
                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Controller
                        name="clientId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Client</FieldLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((client: any) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="billingFrom"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Billing From</FieldLabel>
                                <Input type="date" {...field} />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="billingTo"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Billing To</FieldLabel>
                                <Input type="date" {...field} />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="invoiceDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Invoice Date</FieldLabel>
                                <Input type="date" {...field} />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Due Date</FieldLabel>
                                <Input type="date" {...field} />
                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Notes (Optional)</FieldLabel>
                                <Textarea {...field} rows={3} />
                            </Field>
                        )}
                    />

                </FieldGroup>
            </CardContent>
        </Card>
    )
}

export default InvoiceDetailsForm