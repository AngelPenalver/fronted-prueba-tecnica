"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import styles from "./create_note.module.css";
import X from "../../../../public/x.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { noteSlice } from "@/redux/features/noteSlice";
import { useCreateNoteMutation, useGetNotesQuery } from "@/redux/services/notesApi";
import { SubmitHandler, useForm } from "react-hook-form";
import { NoteForm } from "@/app/types/type-note";
import Swal from "sweetalert2";
import { useGetTagsQuery } from "@/redux/services/tagsApi";

export default function CreateNote(){
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteForm>({ mode: "onBlur" });

  const userId = useSelector((state: RootState) => state?.userReducer?.userData.userId);
  const dispatch = useDispatch();
  const { refetch: refetchTags } = useGetTagsQuery(null);
  const { refetch: refetchAllNotes } = useGetNotesQuery(userId);
  const [createNote] = useCreateNoteMutation();

  const isActive = useSelector((state: RootState) => state.noteReducer.actived_modal_create);

  const handleDisable = useCallback(() => {
    dispatch(noteSlice.actions.toggleModal({ modal: "create", value: false }));
  }, [dispatch]);

  const onSubmit: SubmitHandler<NoteForm> = useCallback(
    async (data) => {
      try {
        const result = await createNote({
          title: data.title,
          description: data.description,
          userId,
          tag_name: data.tag_name
        }).unwrap();

        if (result) {
          reset();
          handleDisable();
          refetchAllNotes();
          refetchTags()
          Swal.fire({
            title: "¡Éxito!",
            text: "Nota creada correctamente.",
            icon: "success",
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "No se pudo crear la nota. Inténtalo de nuevo.",
          icon: "error",
        });
        console.error("Error creating note:", err);
      }
    },
    [createNote, userId, reset, handleDisable, refetchAllNotes, refetchTags]
  );

   if (!isActive) return null;

  return (
    <div className={isActive ? styles.contain_modal_create : styles.disable}>
      <div id={styles.closed}>
        <Image src={X} alt="Cerrar" width={40} onClick={handleDisable} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.content_modal_create}>
          <h2>Crea una nota</h2>
          <div id={styles.error_div}>
          {errors.tag_name && <p>{errors.tag_name.message}</p>}
        </div>
        <input
          type="text"
          {...register("title", {
            minLength: {
              value: 3,
              message: "El título debe tener al menos 3 caracteres",
            },
          })}
          placeholder="Título..."
          className={errors.title ? styles.error_input : ""}
        />
        <div id={styles.error_div}>
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <input
          type="text"
          {...register("tag_name", {
            minLength: {
              value: 2,
              message: "Ingrese una etiqueta valida",
            },
          })}
          placeholder="Etiqueta..."
          className={errors.tag_name ? styles.error_input : ""}
        />
        <div id={styles.error_div}>
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <textarea
          rows={7}
          {...register("description", {
            required: "La descripción es requerida",
            minLength: {
              value: 5,
              message: "La descripción debe tener al menos 5 caracteres",
            },
          })}
          placeholder="Escribe una descripción..."
          className={errors.description ? styles.error_input : ""}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar nota"}
        </button>
      </form>
    </div>
  );
}