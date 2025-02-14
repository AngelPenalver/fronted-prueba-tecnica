"use client";
import React, { useCallback } from "react";
import styles from "./detail.module.css";
import X from "../../../../public/x.png";
import Edit from "../../../../public/edit.svg";
import Delete from "../../../../public/delete.svg";
import Archive from "../../../../public/archive.svg";
import {
  useArchiveNoteMutation,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useUnarchiveNoteMutation,
} from "@/redux/services/notesApi";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleModal, clearId, setNotes } from "@/redux/features/noteSlice";
import Swal from "sweetalert2";

export default function Detail() {
  const userId = useSelector(
    (state: RootState) => state.userReducer.userData.userId
  );
  const [archiveNote] = useArchiveNoteMutation();
  const [unarchiveNote] = useUnarchiveNoteMutation();
  const {data: allNotes, refetch: refetchAllNotes } = useGetNotesQuery(userId);
  const dispatch = useDispatch();
  const note = useSelector((state: RootState) => state.noteReducer.noteDetail);
  const isActive = useSelector(
    (state: RootState) => state.noteReducer?.actived_modal_detail
  );
  const id = note?.id ? note.id : ''
  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const handleDisable = useCallback(() => {
    dispatch(toggleModal({ modal: "detail", value: false }));
    dispatch(clearId());
  }, [dispatch]);

  const handleEnableEditNote = useCallback(() => {
    dispatch(toggleModal({ modal: "update", value: true }));
    dispatch(toggleModal({ modal: "detail", value: false }));
  }, [dispatch]);

 
  const handleArchive = async () => {
    try {
      await archiveNote(id).unwrap();
      refetchAllNotes()

      Swal.fire({
        title: "Nota Archivada",
        icon: "success",
      });
      dispatch(toggleModal({modal:'detail', value: false}))

    } catch (error) {
      Swal.fire({
        title: "Error al archivar la nota",
        icon: "error",
        text: `${(error as Error).message}`,
      });
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveNote(id).unwrap();
      refetchAllNotes()
      dispatch(toggleModal({modal:'detail', value: false}))
      Swal.fire({
        title: "Nota Desarchivada",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error al archivar la nota",
        icon: "error",
        text: `${(error as Error).message}`,
      });
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed && note?.id) {
        await deleteNote({ id: note.id }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Nota eliminada",
          text: "Nota eliminada con éxito!",
        });
        refetchAllNotes();
        handleDisable();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar la nota",
        text: `Error: ${(err as { data: { message: string } }).data.message}`,
      });
    }
  }, [deleteNote, note, refetchAllNotes, handleDisable]);

  React.useEffect(() => {
    if(allNotes){

      dispatch(setNotes(allNotes))
    }
  },[allNotes])

  if (!isActive) return null;

  return (
    <div className={styles.contain_modal_detail}>
      <div id={styles.closed} onClick={handleDisable}>
        <Image src={X} alt="X" width={40} />
      </div>
      <div className={styles.content_modal_detail}>
        <div id={styles.icons}>
          {note?.archived ? (
            <div onClick={handleUnarchive}>
              <Image src={Archive} alt="Archive" width={28} />
              <p>Desarchivar</p>
            </div>
          ) : (
            <div onClick={handleArchive}>
              <Image src={Archive} alt="Archive" width={28} />
              <p>Archivar</p>
            </div>
          )}
          <div onClick={handleEnableEditNote}>
            <Image src={Edit} alt="Edit" width={28} />
            <p>Editar</p>
          </div>
          <div onClick={handleDelete}>
            <Image src={Delete} alt="Delete" width={28} />
            <p>Eliminar</p>
          </div>
        </div>
        <h2>{note?.title || "(Sin título)"}</h2>
        <p>{note?.description}</p>
        <a>{note?.tag?.name}</a>
      </div>
    </div>
  );
}
