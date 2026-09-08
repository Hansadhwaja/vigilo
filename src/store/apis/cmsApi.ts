import { baseApi } from "./baseApi";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsPage: builder.query({
      query: (name) => `/cms/${name}`,
      providesTags: ["CMS"],
    }),
    editCmsPage: builder.mutation({
      query: (data) => ({
        url: "/cms/upsert",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CMS"],
    }),
  }),
});

export const { useGetCmsPageQuery, useEditCmsPageMutation } = cmsApi;
