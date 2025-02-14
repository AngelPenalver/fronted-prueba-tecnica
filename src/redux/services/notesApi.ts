import { Note, NoteForm } from "@/app/types/type-note";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const noteApi = createApi({
  reducerPath: "noteApi",
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
    getNotes: builder.query<Note[], string>({
      query: (userId) => ({
        url: "notes",
        method: "GET",
        params: { userId },
      }),
      transformErrorResponse: (response) => {
        if (response.data) {
          return response.data;
        }
        return response;
      },
    }),
    getNoteById: builder.query<Note, { id: string }>({
      query: ({ id }) => `notes/${id}`,
    }),
    getNotesByFilters: builder.query({
      query: ({ userId, tagName, archived }) => ({
        url: "notes/filter",
        params: { userId, tagName, archived },
      }),
    }),
    createNote: builder.mutation<Note, Partial<NoteForm>>({
      query: (newNote) => ({
        url: "notes",
        method: "POST",
        body: newNote,
      }),
    }),
    updateNote: builder.mutation<Note, { id: string; newNote: Partial<NoteForm> }>({
      query: ({ id, newNote }) => ({
        url: `notes/${id}`,
        method: "PATCH",
        body: newNote,
      }),
    }),
    deleteNote: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
    }),
    archiveNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `notes/${id}/archived`,
        method: "PATCH",
      }),
    }),
    unarchiveNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `notes/${id}/unarchived`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteByIdQuery,
  useGetNotesByFiltersQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useArchiveNoteMutation,
  useUnarchiveNoteMutation
} = noteApi;
