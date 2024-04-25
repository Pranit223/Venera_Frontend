import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { server } from "../store";
import { AllUserMessageResponse, DeleteUserReq, MessageResponse, UserResponse, UserType } from "../../types/Types";
import axios from "axios";

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, UserType>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    getAllUser: builder.query<AllUserMessageResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, DeleteUserReq>({
      query: ({ userId, adminId }) => ({
        url: `${userId}?id=${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});


export const getUser=async(id:string)=>{
  try {
    const { data } :{data:UserResponse}= await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export const {useLoginMutation,useDeleteUserMutation,useGetAllUserQuery}=userApi;