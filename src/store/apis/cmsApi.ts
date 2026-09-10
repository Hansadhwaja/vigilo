import { baseApi } from "./baseApi";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsPage: builder.query({
      query: ({ name, type }) => `/cms/${name}?type=${type}`,
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
