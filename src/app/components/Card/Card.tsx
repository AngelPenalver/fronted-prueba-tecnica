import { useDispatch } from "react-redux";
import styles from "./card.module.css";
import { noteSlice } from "@/redux/features/noteSlice";
import React from "react";
import { Tag } from "@/app/types/type-tag";

interface CardProps {
  title: string | null;
  description: string;
  id: string;
  tag: Tag;
}

export default function Card({ title, description, id, tag }: CardProps) {
  const dispatch = useDispatch();

  const handleEnable = () => {
    dispatch(noteSlice.actions.setId(id));
    dispatch(noteSlice.actions.toggleModal({ modal: "detail", value: true }));
  };

  return (
    <div
      className={styles.content_card}
      onClick={handleEnable}
      role="button"
      tabIndex={0}
    >
      <div id={styles.title}>
        <h2>{title || "Sin título"}</h2>
      </div>
      <div id={styles.text}>
        <p>{description}</p>
      </div>
      <div id={styles.footer_card}>{tag?.name && <a>#{tag.name}</a>}</div>
    </div>
  );
}
