import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ServicePricingFormValues } from "@/schemas";

const services = [
    "static",
    "patrol",
    "premiumSecurity",
    "standardPatrol",
    "24/7Monitoring",
    "healthcareSecurity",
    "industrialSecurity",
];

type ServicePricingState = {
    data: Record<string, ServicePricingFormValues>;
};

const initialState: ServicePricingState = {
    data: services.reduce((acc, service) => {
        acc[service] = {
            service,
            dailyPrice: "",
            hourlyPrice: "",
            priceType: "daily",
            renewalDate: "",
        };
        return acc;
    }, {} as Record<string, ServicePricingFormValues>),
};

const servicePricingSlice = createSlice({
    name: "servicePricing",
    initialState,
    reducers: {
        setServicePricing: (
            state,
            action: PayloadAction<ServicePricingFormValues>
        ) => {
            const { service } = action.payload;
            state.data[service] = action.payload;
        },

        resetServicePricing: (state, action: PayloadAction<string>) => {
            state.data[action.payload] = {
                service: action.payload,
                dailyPrice: "",
                hourlyPrice: "",
                priceType: "daily",
                renewalDate: "",
            };
        },
    },
});

export const { setServicePricing, resetServicePricing } =
    servicePricingSlice.actions;

export default servicePricingSlice.reducer;