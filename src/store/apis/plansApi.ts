import { baseApi } from "./baseApi";

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: (params = {}) => {
        const { isActive } = params;
        const qs = new URLSearchParams();
        if (isActive) qs.set("isActive", isActive);
        return qs.toString()
          ? `/plans/getPlans?${qs.toString()}`
          : "/plans/getPlans";
      },
      providesTags: ["Plans"],
    }),
  }),
});

export const { useGetPlansQuery } = plansApi;
