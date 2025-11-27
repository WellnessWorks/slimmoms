import css from "./LoginForm.module.css";
import { useId } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../FormInput/FormInput.jsx";

// Validasyon şeması
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("E-mail is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 20 characters")
    .required("Password is required"),
});

// Varsayılan değerler
const initialValues = { email: "", password: "" };

const LoginForm = () => {
  const emailFieldId = useId();
  const passwordFieldId = useId();

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: initialValues,
  });
  return (
    <div>
      <form onSubmit={handleSubmit()} className={css.loginForm}>
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
      </form>
    </div>
  );
};

export default LoginForm;
