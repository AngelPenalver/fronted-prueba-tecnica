import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Tag } from "@/app/types/type-tag";
export const tagApi = createApi({
  reducerPath: "tagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend-app-note.zeabur.app/api/v1/",
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
        return data;
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
    getTags: builder.query<Tag[], null>({
      query: () => ({
        url: "tags",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTagsQuery} = tagApi