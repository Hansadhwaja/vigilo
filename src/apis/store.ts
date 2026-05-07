import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import servicePricingSlice from "./slices/servicePricingSlice";
import schedulingSlice from "./slices/schedulingSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    servicePricing: servicePricingSlice,
    scheduling: schedulingSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
