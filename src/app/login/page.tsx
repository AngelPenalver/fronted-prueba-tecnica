"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./page.module.css";
import { ResponseUser, UserForm } from "../types/type-user";
import { useLoginMutation } from "@/redux/services/usersApi";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { TokenDecode } from "../types/type-token";
import { setUserData } from "@/redux/features/userSlice";
import ModalCharge from "../components/ModalCharge/ModalCharge";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

export default function Login() {
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserForm>({ mode: "onBlur" });

  const dispatch = useDispatch();
  const router = useRouter();
  const userData = useSelector((state: RootState) => state.userReducer.userData);
  const [activedModal, setActivedModal] = React.useState(false);
  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    setActivedModal(true);

    try {
      const loginUser = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { token } = loginUser as unknown as ResponseUser;
      if (token) {
        const decode = jwtDecode<TokenDecode>(token);
        dispatch(
          setUserData({
            email: decode.email,
            userId: decode.id,
            token,
          })
        );

        Swal.fire({
          title: "Bienvenido!",
          text: "Sesión iniciada con éxito",
          icon: "success",
        });
        router.push("/home");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });

      setError("email", { type: "manual", message: errorMessage });
      setError("password", { type: "manual", message: errorMessage });
    } finally {
      setActivedModal(false);
    }
  };

  useEffect(() => {
    if (userData.userId) {
      router.push("/home");
    }
  }, [userData, router]);

  useEffect(() => {
    setActivedModal(true);
    const timer = setTimeout(() => setActivedModal(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.contain_login}>
      <ModalCharge actived={activedModal} />
      <form id={styles.form_login} onSubmit={handleSubmit(onSubmit)}>
        <div id={styles.header_form}>
          <h2>Iniciar Sesión</h2>
        </div>
        <div>
          <label>Correo Electrónico</label>
          <div className={styles.errors}>
            {errors.email && <a>{errors.email.message}</a>}
          </div>
          <input
            type="text"
            placeholder="ejemplo@ejemplo.com"
            {...registerForm("email", {
              required: {
                message: "El correo electrónico es requerido",
                value: true,
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "El correo electrónico no es válido",
              },
            })}
            style={errors.email && { border: "1.5px #f00 solid" }}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <div className={styles.errors}>
            {errors.password && <a>{errors.password.message}</a>}
          </div>
          <input
            type="password"
            placeholder="************"
            {...registerForm("password", {
              required: {
                message: "La contraseña es requerida",
                value: true,
              },
              minLength: {
                message: "La contraseña debe tener al menos 7 caracteres",
                value: 7,
              },
              maxLength: {
                message: "La contraseña no puede tener más de 15 caracteres",
                value: 15,
              },
            })}
            style={errors.password && { border: "1.5px #f00 solid" }}
          />
        </div>
        <p id={styles.links}>
          ¿No tienes una cuenta?{" "}
          <a onClick={() => router.push("/register")}>Regístrate</a>
        </p>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}