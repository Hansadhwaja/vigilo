import { baseApi } from "./baseApi";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  mobile: string;
  countryCode: string | null;
  address: string;
  isVerified: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GetProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface EditProfileRequest {
  name?: string;
  mobile?: string;
  address?: string;
  avatar?: string;
}

export interface EditProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({
        url: "/users/get-profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    
    editProfile: builder.mutation<EditProfileResponse, EditProfileRequest>({
      query: (data) => ({
        url: "/users/edit-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useEditProfileMutation } = profileApi;
