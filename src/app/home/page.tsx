"use client";
import React, { useEffect, useState } from "react";
import Card from "../components/Card/Card";
import CreateNote from "../components/CreateNote/CreateNote";
import Detail from "../components/Detail/Detail";
import SideBar from "../components/SideBar/SideBar";
import styles from "./page.module.css";
import { useGetNoteByIdQuery, useGetNotesQuery } from "@/redux/services/notesApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UpdateNote from "../components/UpdateNote/UpdateNote";
import { useRouter } from "next/navigation";
import { setNoteDetail, setNotes } from "@/redux/features/noteSlice";
import { useGetTagsQuery } from "@/redux/services/tagsApi";
import { setTags } from "@/redux/features/tagSlice";
import ModalCharge from "../components/ModalCharge/ModalCharge";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.userReducer.userData);
  const id = useSelector((state: RootState) => state.noteReducer.id);
  const notes = useSelector((state: RootState) => state.noteReducer.notes);
  const [active, setActive] = useState(false);

  const { data: notesData, refetch: refetchNotes } = useGetNotesQuery(userData.userId, {
    skip: !userData.userId,
  });

  const { data: tagsData } = useGetTagsQuery(null);
  const { data: noteDetailData } = useGetNoteByIdQuery({ id }, { skip: !id });

  useEffect(() => {
    if (!userData.userId) {
      router.push("/");
    }
  }, [userData, router]);

  useEffect(() => {
    setActive(true);
    if (notesData) {
      dispatch(setNotes(notesData));
    }
    if (tagsData) {
      dispatch(setTags(tagsData));
    }
    setTimeout(() => {
      setActive(false);
    }, 2000);
  }, [notesData, tagsData, dispatch]);

  useEffect(() => {
    if (noteDetailData) {
      dispatch(setNoteDetail(noteDetailData));
    }
  }, [noteDetailData, dispatch]);
console.log(noteDetailData)
  return (
    <div className={styles.contain}>
      {id && <Detail />}
      <ModalCharge actived={active} />
      <UpdateNote />
      <CreateNote />
      <SideBar />
      <div id={styles.contain_card}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card
              key={note.id}
              title={note.title}
              description={note.description}
              id={note.id}
              tag={note.tag}
            />
          ))
        ) : (
          <h2 id={styles.not_found}>No tienes notas creadas</h2>
        )}
      </div>
    </div>
  );
}