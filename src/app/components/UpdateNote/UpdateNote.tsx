"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Swal from "sweetalert2";
import { RootState } from "@/redux/store";
import { clearNoteDetail, setNoteDetail, setNotes, toggleModal } from "@/redux/features/noteSlice";
import { NoteForm } from "@/app/types/type-note";
import { useGetNotesQuery, useUpdateNoteMutation } from "@/redux/services/notesApi";
import X from "../../../../public/x.png";
import styles from "./update_note.module.css";
import { useGetTagsQuery } from "@/redux/services/tagsApi";

export default function UpdateNote() {
  const note = useSelector((state: RootState) => state.noteReducer.noteDetail);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userReducer.userData.userId);
  const isActived = useSelector((state: RootState) => state.noteReducer.actived_modal_update);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteForm>({
    mode: "onBlur",
    defaultValues: {
      title: note?.title ?? "",
      description: note?.description ?? "",
      tag_name: note?.tag?.name ?? "",
    },
  });

  const [updateNote, { isLoading: isLoadingUpdate }] = useUpdateNoteMutation();
  const { refetch: refetchTags } = useGetTagsQuery(null);
  const { data: notesData, refetch: refetchAllNotes } = useGetNotesQuery(userId, {
    refetchOnMountOrArgChange: true, 
  });

  useEffect(() => {
    if (note) {
      reset({
        title: note.title ?? "",
        description: note.description ?? "",
        tag_name: note.tag?.name ?? "",
      });
    }
  }, [note, reset, notesData]);

  const handleDisable = () => {
    dispatch(toggleModal({ modal: "update", value: false }));
  };

  const onSubmit: SubmitHandler<NoteForm> = async (data) => {
    try {
      const result = await Swal.fire({
        icon: "question",
        title: "¿Desea guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: "No guardar",
      });

      if (result.isConfirmed && note?.id) {
        const update = await updateNote({
          id: note.id,
          newNote: data,
        }).unwrap();

        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Nota actualizada con éxito",
        });

        handleDisable();
        reset();
        refetchTags();
        refetchAllNotes();
        dispatch(clearNoteDetail());
        dispatch(setNoteDetail(update))

        if (notesData) {
          dispatch(setNotes(notesData));
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: "Cambios no guardados",
          icon: "info",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la nota. Por favor, inténtalo de nuevo.",
      });
    }
  };

  if (!isActived) return null;

  return (
    <div className={isActived ? styles.contain_modal_update : styles.disable}>
      <div id={styles.closed}>
        <Image src={X} alt="Cerrar" width={40} onClick={handleDisable} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.content_update_modal}>
        <h2>Actualizar nota</h2>

        <div id={styles.error_div}>
          {errors.title && <p>{errors.title.message}</p>}
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
        />

        <div id={styles.error_div}>
          {errors.tag_name && <p>{errors.tag_name.message}</p>}
        </div>
        <input
          type="text"
          {...register("tag_name", {
            minLength: {
              value: 2,
              message: "Ingrese una etiqueta válida",
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
          placeholder="Escriba una descripción..."
          className={errors.description ? styles.error_input : ""}
        />

        <button type="submit" disabled={isLoadingUpdate}>
          {isLoadingUpdate ? "Guardando..." : "Guardar nota"}
        </button>
      </form>
    </div>
  );
}