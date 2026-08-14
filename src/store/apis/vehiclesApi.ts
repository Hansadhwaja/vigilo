import { baseApi } from "./baseApi";

export const vehiclesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicles: builder.query({
      query: (params = {}) => {
        const { page, limit, status } = params;
        const qs = new URLSearchParams();

        if (limit) qs.append("limit", limit.toString());
        if (page) qs.append("page", page.toString());
        if (status) qs.append("status", status);

        return qs.toString() ? `/vehicles?${qs.toString()}` : "/vehicles";
      },
      providesTags: ["Vehicle"],
    }),
    getVehicleById: builder.query({
      query: (id) => `/vehicles/${id}`,
      providesTags: ["Vehicle"],
    }),
    createVehicle: builder.mutation({
      query: (data) => ({
        url: "/vehicles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vehicle"],
    }),
    editVehicle: builder.mutation({
      query: ({ data, id }) => ({
        url: `/vehicles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vehicle"],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicle"],
    }),
  }),
});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useEditVehicleMutation,
  useDeleteVehicleMutation,
} = vehiclesApi;
