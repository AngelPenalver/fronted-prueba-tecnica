"use client";
import { setUserData } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import styles from './page.module.css';
import icon_button from '../../public/icon-pen.svg';
import icon_linkedin from '../../public/icon-linkedin.svg';
import icon_github from '../../public/icon-github.svg';
import Image from "next/image";

export default function Landing() {
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = window.localStorage.getItem("userData");

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          dispatch(setUserData(userData));

          if (userData?.userId) {
            router.push('/home');
          }
        } catch (error) {
          console.error("Error parsing userData from localStorage:", error);
        }
      }
    }
  }, [dispatch, router]);

  const handleRoute = () => {
    router.push('/login');
  };

  return (
    <section className={styles.contain_home}>
      <div id={styles.content_home}>
        <h2>Bienvenido!</h2>
        <button onClick={handleRoute}>
          <Image src={icon_button} alt="icon_button" width={18} />
          Ingresar
        </button>
      </div>
      <footer id={styles.footer}>
        <p>
          Desarrollado por <b>Ángel Peñalver</b>
        </p>
        <ul>
          <li>
            <a href="https://github.com/AngelPenalver" target="_blank" rel="noopener noreferrer">
              <Image src={icon_github} alt="GitHub" />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/angelpenalver/" target="_blank" rel="noopener noreferrer">
              <Image src={icon_linkedin} alt="LinkedIn" />
            </a>
          </li>
        </ul>
      </footer>
    </section>
  );
}