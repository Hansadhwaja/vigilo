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
    subscribePlan: builder.mutation({
      query: (data) => ({
        url: "/plans/subscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetPlansQuery, useSubscribePlanMutation } = plansApi;
