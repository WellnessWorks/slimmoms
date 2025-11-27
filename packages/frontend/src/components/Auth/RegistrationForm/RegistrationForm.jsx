import css from "./RegistrationForm.module.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useId } from "react";
import FormInput from "../FormInput/FormInput";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../../../redux/auth/authOperations";
import { Link } from "react-router-dom";
import { clearAuthError } from "../../../redux/auth/authSlice";
import {
  selectIsLoading,
  selectError,
} from "../../../redux/auth/authSelectors";

//Validasyon Şeması
const registerSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters")
    .required("Password is required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectError);

  const nameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });
  // Hata durumunu temizleme
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (values) => {
    const { ...userData } = values;
    try {
      await dispatch(registerUser(userData)).unwrap();
      reset();
    } catch {
      // Hata yönetimi Redux thunk (registerUser operasyonu)
      // ve Redux state (authError) tarafından yapılıyor.
      // Bu catch bloğu, .unwrap() tarafından fırlatılan hatayı
      // yakalayarak uygulamanın çökmesini engellemek için gereklidir.
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className={css.registerForm}>
        <FormInput
          id={nameFieldId}
          label="Name"
          type="name"
          placeholder="Name *"
          register={register("name")}
          error={errors.name?.message}
        />

        <FormInput
          id={emailFieldId}
          label="E-mail"
          type="email"
          placeholder="E-mail *"
          register={register("email")}
          error={errors.email?.message}
        />

        <FormInput
          id={passwordFieldId}
          label="Password"
          type="password"
          placeholder="Password *"
          register={register("password")}
          error={errors.password?.message}
        />
        {authError && <p className={css.authErrorMessage}>{authError}</p>}
        <div className={css.registerButtonWrapper}>
          <button type="submit" disabled={isLoading} className="form-button">
            {isLoading ? "Loading..." : "Register"}
          </button>
          <Link to="/login">
            <button type="button" className="form-button-register">
              Log in
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
