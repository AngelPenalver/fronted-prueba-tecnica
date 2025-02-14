"use client";
import Image from "next/image";
import styles from "./sidebar.module.css";
import Search_Icon from "../../../../public/icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { setNotes, toggleModal } from "@/redux/features/noteSlice";
import { useGetNotesByFiltersQuery } from "@/redux/services/notesApi";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation"; 
import { clearUserData } from "@/redux/features/userSlice"; 

export default function SideBar() {
  const dispatch = useDispatch();
  const router = useRouter(); 
  const userId = useSelector((state: RootState) => state.userReducer.userData.userId);
  const tags = useSelector((state: RootState) => state.tagReducer.tags);

  const [tag, setTag] = React.useState<string>("");
  const [archived, setArchived] = React.useState<boolean | null>(null);

  const { data: filteredNotes } = useGetNotesByFiltersQuery(
    { userId, tagName: tag, archived },
    { skip: !userId }
  );

  useEffect(() => {
    if (filteredNotes) {
      dispatch(setNotes(filteredNotes));
    }
  }, [filteredNotes, dispatch]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const isArchived = value === "true";
    setArchived(isArchived);
  };

  const handleTagClick = (tagName: string) => {
    setTag(tagName);
  };

  const handleEnable = () => {
    dispatch(toggleModal({ modal: "create", value: true }));
  };

  const handleLogout = () => {
    dispatch(clearUserData());

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("userData");
    }

    router.push("/");
  };

  return (
    <section className={styles.content_side_bar}>
      <div id={styles.header_side_bar}>
        <input type="text" placeholder="Buscar" />
        <div>
          <Image src={Search_Icon} alt="Buscar" />
        </div>
      </div>
      <div id={styles.contain_tags}>
        <div id={styles.header_tags}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <g clipPath="url(#clip0_514_1883)">
              <path
                d="M0.112881 1.60752C0.306738 1.19824 0.718945 0.9375 1.17188 0.9375H13.8281C14.2822 0.9375 14.6924 1.19824 14.8857 1.60752C15.082 2.0168 15.0205 2.50107 14.71 2.85146L9.375 9.40137V13.125C9.375 13.4795 9.17578 13.8047 8.85645 13.9629C8.54004 14.1211 8.15918 14.0889 7.875 13.875L6 12.4688C5.7627 12.293 5.625 12.0146 5.625 11.7188V9.40137L0.264902 2.85146C-0.0218263 2.50107 -0.081006 2.0168 0.11291 1.60752H0.112881Z"
                fill="#3471FF"
              />
            </g>
            <rect x="0.5" y="0.5" width="14" height="14" stroke="#272727" />
            <defs>
              <clipPath id="clip0_514_1883">
                <rect width="15" height="15" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h4 id={styles.titles}>Filtros</h4>
        </div>
        <div id={styles.filter_notes}>
          <select name="Filtrar" onChange={handleFilterChange}>
            <option value="false">Filtrar</option>
            <option value="true">Archivadas</option>
            <option value="false">Activas</option>
          </select>
        </div>
        <h2 id={styles.titles}>Filtrar por etiquetas</h2>
        <div id={styles.content_tags}>
          {tags.map((tagItem) => (
            <a
              key={tagItem.name}
              className={`${styles.tag} ${tag === tagItem.name ? styles.tag_active : ""}`}
              onClick={() => handleTagClick(tagItem.name)}
            >
              #{tagItem.name}
            </a>
          ))}
        </div>
      </div>
      <div id={styles.footer_side}>
        <a onClick={handleEnable}>Crear nueva nota</a>
        <a onClick={handleLogout}>Cerrar Sesión</a> 
      </div>
    </section>
  );
}