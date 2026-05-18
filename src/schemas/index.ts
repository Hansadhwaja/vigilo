import { z } from "zod";

const dateString = z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format");

//Broadcast Message
export const broadcastSchema = z.object({
    sendToAll: z.boolean(),
    guardIds: z.array(z.string()).optional(),
    projectId: z.string().optional(),
    message: z.string().min(1, "Message is required"),
    attachment: z.instanceof(File).optional(),
}).refine((data) => {
    if (!data.sendToAll) {
        return data.guardIds && data.guardIds.length > 0;
    }
    return true;
}, {
    message: "Select at least one guard",
    path: ["guardIds"],
});

export type BroadCastFormValues = z.infer<typeof broadcastSchema>;

//Alarm
export const alarmSchema = z.object({
    title: z.string().min(1, "Title is required"),
    siteId: z.string().min(1, "Site is required"),
    type: z.string().min(1, "Type is required"),
    priority: z.string().min(1, "Priority is required"),
    guardIds: z.array(z.string()).min(1, "At least 1 guard required"),
    eta: z.number().optional(),
    slaTime: z.number().min(0, "SLA must be positive"),
    unitPrice: z.number().min(0, "Price must be positive"),
    location: z.string().optional(),
    monitoringCompany: z.string().min(1, "Monitoring Company Required"),
    license: z.string().min(1, "License Required"),
    description: z.string().optional(),
});

export type AlarmFormValues = z.infer<typeof alarmSchema>;


//Invoice

export const customServiceSchema = z.object({
    title: z.string().min(1, "Title is required"),

    days: z.coerce
        .number()
        .min(1, "Minimum 1 day"),

    price: z.coerce
        .number()
        .min(0, "Price cannot be negative"),
});
export type CustomServiceFormValues = z.infer<typeof customServiceSchema>;

export const invoiceOrdersSchema = z.object({
    id: z.string(),
    title: z.string(),
    startDate: z.string(),
    startTime: z.string(),
    endDate: z.string(),
    endTime: z.string(),
    hours: z.number(),
    days: z.number(),
    dailyPrice: z.string(),
    hourlyPrice: z.string(),
    priceType: z.string(),
    renewalDate: z.string(),
});
export type InvoiceOrdersFormValues = z.infer<typeof invoiceOrdersSchema>;

export const invoiceAlarmsSchema = z.object({
    id: z.string(),
    siteName: z.string(),
    alarmType: z.string(),
    price: z.number(),
});
export type InvoiceAlarmsFormValues = z.infer<typeof invoiceAlarmsSchema>;

export const invoiceSchema = z
    .object({
        clientId: z.string().min(1, "Client is required"),
        billingFrom: dateString,
        billingTo: dateString,
        invoiceDate: dateString,
        dueDate: dateString,
        notes: z.string().optional(),
        orders: z.array(invoiceOrdersSchema).default([]),
        alarms: z.array(invoiceAlarmsSchema).default([]),
        services: z.array(customServiceSchema).default([]),
    })
    .refine((data) => data.billingTo >= data.billingFrom, {
        message: "Billing To must be after Billing From",
        path: ["billingTo"],
    });

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const servicePricingSchema = z.object({
    service: z.string().min(1, "Service is required"),

    dailyPrice: z
        .string()
        .refine((val) => val === undefined || Number(val) > 0, {
            message: "Daily Price must be greater than 0",
        }),

    hourlyPrice: z
        .string()
        .refine((val) => val === undefined || Number(val) > 0, {
            message: "Hourly Price must be greater than 0",
        }),

    priceType: z.enum(["daily", "hourly"]),

    renewalDate: dateString,
});

export type ServicePricingFormValues = z.infer<typeof servicePricingSchema>;

//Scheduling
export const assignmentSchema = z
    .object({
        description: z.string().min(1, "Description is required"),

        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),

        orderId: z.string().min(1, "Order is required"),

        guardIds: z
            .array(z.string())
            .min(1, "Select at least one guard"),

        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true;

            return data.endDate >= data.startDate;
        },
        {
            message: "End date must be after or equal to start date",
            path: ["endDate"],
        }
    )
    .refine(
        (data) => {
            if (!data.startTime || !data.endTime) return true;

            return data.endTime > data.startTime;
        },
        {
            message: "End time must be after start time",
            path: ["endTime"],
        }
    );

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

//Client Management
export const orderSchema = z.object({
    serviceType: z
        .string()
        .min(1, "Please select a service type"),

    locationName: z
        .string()
        .optional(),

    locationAddress: z
        .string()
        .min(1, "Location address is required"),

    siteServiceLat: z
        .number()
        .min(1, "Latitude is required"),

    siteServiceLng: z
        .number()
        .min(1, "Longitude is required"),

    guardsRequired: z
        .number()
        .min(1, "At least 1 guard is required"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .optional(),

    startDate: z
        .string()
        .min(1, "Start date is required"),

    endDate: z
        .string()
        .min(1, "End date is required"),

    startTime: z
        .string()
        .min(1, "Start time is required"),

    endTime: z
        .string()
        .min(1, "End time is required"),

    images: z.array(z.string()).optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export const rejectOrderSchema = z.object({
    reason: z
        .string()
        .optional(),
});

export type RejectOrderFormValues = z.infer<typeof rejectOrderSchema>;

export const clientSchema = z.object({
    name: z.string().min(1, "Please Enter Name"),
    email: z.string().min(1, "Please Enter Email"),
    mobile: z.string().min(1, "Please Enter Mobile"),
    address: z.string().min(1, "Please Enter Address"),
    avatar: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;


//HR & Compliance
export const guardSchema = z.object({
    name: z.string().min(1, "Please Enter Name"),
    email: z.string().min(1, "Please Enter Email"),
    mobile: z.string().min(1, "Please Enter Mobile"),
});

export type GuardFormValues = z.infer<typeof guardSchema>;

export const timeSheetSchema = z.object({
    shiftStartTime: z.string().min(1, "Please Enter Start Time"),
    shiftEndTime: z.string().min(1, "Please Enter End Time"),
});

export type TimeSheetFormValues = z.infer<typeof timeSheetSchema>;

//Guard Payment
export const guardPaymentSchema = z.object({
    guardId: z
        .string()
        .min(1, "Guard is required"),

    staticIds: z
        .array(z.string()),

    hourlyRate: z
        .number()
        .min(0, "Hourly rate cannot be negative"),

    overtimeHourlyRate: z
        .number()
        .min(
            0,
            "Overtime hourly rate cannot be negative"
        ),

    regularHours: z
        .number()
        .min(0, "Regular hours cannot be negative"),

    overtimeHours: z
        .number()
        .min(0, "Overtime hours cannot be negative"),

    totalHours: z
        .number()
        .min(0),

    taxDeduction: z
        .number()
        .min(0, "Tax deduction cannot be negative"),

    otherDeductions: z.number().min(0, "Other deductions cannot be negative"),
    basePay: z.number().min(0),
    overtimePay: z.number().min(0),
    totalPay: z.number().min(0),
    fromDate: z.string().min(1, "Select Start Date"),
    toDate: z.string().min(1, "Select End Date"),
});

export type GuardPaymentFormValues = z.infer<
    typeof guardPaymentSchema
>;

//Patrolling

export const checkpointSchema = z.object({
    name: z
        .string()
        .min(3, "Checkpoint name must be at least 3 characters"),

    checkpointLat: z
        .number()
        .min(-90, "Latitude must be greater than -90")
        .max(90, "Latitude must be less than 90"),

    checkpointLng: z
        .number()
        .min(-180, "Longitude must be greater than -180")
        .max(180, "Longitude must be less than 180"),

    range: z
        .number()
        .min(1, "Range must be at least 1 meter")
        .max(1000, "Range cannot exceed 1000 meters"),

    priority: z.enum(["high", "medium", "low"]),

    checkpointDescription: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(500, "Description cannot exceed 500 characters"),
});

export type CheckpointFormValues = z.infer<typeof checkpointSchema>;


export const subSiteSchema = z.object({
    name: z
        .string()
        .min(3, "Sub-site name must be at least 3 characters"),

    unitPrice: z
        .number()
        .min(1, "Unit price must be greater than 0"),

    estimatedDuration: z
        .number()
        .min(1, "Duration must be at least 1 minute"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description is too long"),
});

export type SubSiteFormValues = z.infer<typeof subSiteSchema>;


export const patrolSchema = z.object({
    patrolName: z
        .string()
        .min(1, "Patrol Name is required"),

    guardIds: z
        .array(z.string())
        .min(1, "Select at least one guard"),

    vehicleIds: z
        .array(z.string())
        .min(1, "Select at least one vehicle"),

    orderId: z
        .string()
        .min(1, "Order is required"),

    siteIds: z
        .array(z.string())
        .min(1, "Select at least one site"),

    startDateTime: z
        .string()
        .min(1, "Start date & time is required"),

    estimatedCompletion: z
        .string()
        .min(1, "Estimated completion is required"),

    unitPrice: z
        .number()
        .min(1, "Unit price must be greater than 0"),

    notes: z
        .string()
        .optional(),
});

export type PatrolFormValues = z.infer<typeof patrolSchema>;


export const siteSchema = z.object({
    name: z
        .string()
        .min(1, "Site name is required"),

    address: z
        .string()
        .min(1, "Address is required"),

    description: z
        .string()
        .optional(),

    clientId: z
        .string()
        .min(1, "Client is required"),

    coordinates: z.object({
        lat: z
            .string()
            .min(1, "Latitude is required"),

        lng: z
            .string()
            .min(1, "Longitude is required"),
    }),
});

export type SiteFormValues = z.infer<typeof siteSchema>;