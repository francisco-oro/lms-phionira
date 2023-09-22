import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query:(avatar) => ({
                url: "update-user-avatar",
                method: "PUT",
                body: {avatar},
                credentials: "include" as const,
            })
        }),
        EditProfile: builder.mutation({
            query:({name, email, phoneNumber, dateOfBirth}) => ({
                url: "update-user-info",
                method: "PUT",
                body: {name, phoneNumber, dateOfBirth},
                credentials: "include" as const,
            })
        }),
        updatePassword: builder.mutation({
            query:({oldPassword, newPassword }) => ({
                url: "update-user-password",
                method: "PUT",
                body: {oldPassword, newPassword},
                credentials: "include" as const,
            })
        }),
    })
})


export const {useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation} = userApi