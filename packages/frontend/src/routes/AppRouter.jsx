import React, { useEffect } from "react";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { refreshUser } from "../redux/auth/authOperations";

// Lazy-loaded Sayfalar
const MainPage = React.lazy(() => import("../pages/MainPage/MainPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);
const Layout = React.lazy(() => import("../pages/Layout/Layout"));

const AppRouter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          {/* Login ve Register */}
          <Route path="login" element={<LoginPage />} />

          <Route path="register" element={<RegistrationPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
