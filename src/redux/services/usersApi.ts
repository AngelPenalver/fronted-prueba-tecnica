import { UserData } from "@/app/types/type-user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl:'https://backend-app-note.zeabur.app/api/v1/',
        prepareHeaders: (headers) => {
            headers.set("Accept", "application/json");
            return headers;
          },
          responseHandler: async (response) => {
            const text = await response.text();
            try {
              const data = JSON.parse(text);

              if (data && data.data) {
                return data.data;
              }
              return data
            } catch {
              if (!response.ok) {
                return Promise.reject({
                  status: response.status,
                  message: text,
                });
              }
              return { message: text };
            }
          },
    }),
    endpoints: (builder) => ({
        register: builder.mutation<UserData,Partial<UserData>>({
            query: (registerUser) => ({
                url:'auth/register',
                method: "POST",
                body: registerUser
            }),
            transformErrorResponse: (response) => {
              if (response.data && response.data) {
                return response.data
              }
              return response;
            }
        }),
       login: builder.mutation<UserData,Partial<UserData>>({
          query: (loginUser) => ({
              url:'auth/login',
              method: "POST",
              body: loginUser
          }),
          transformErrorResponse: (response) => {
            if (response.data && response.data) {
              return response.data
            }
            return response;
          }
      })
    })
})
export const {useRegisterMutation, useLoginMutation} = userApi