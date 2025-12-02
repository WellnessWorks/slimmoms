// src/components/AppRouter.jsx
import React, { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { refreshUser } from "../redux/auth/authOperations";

import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

// Lazy-loaded sayfalar
const MainPage = React.lazy(() => import("../pages/MainPage/MainPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);
const Layout = React.lazy(() => import("../pages/Layout/Layout"));
const AuthCalculatorPage = React.lazy(() =>
  import("../pages/AuthCalculatorPage/AuthCalculatorPage")
);

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
            {/* 🔒 MAIN */}
            <Route
              index
              element={
                <RestrictedRoute redirectTo="/calculator">
                  <MainPage />
                </RestrictedRoute>
              }
            />

            {/* 🔒 LOGIN & REGISTER*/}
            <Route
              path="login"
              element={
                <RestrictedRoute redirectTo="/calculator">
                  <LoginPage />
                </RestrictedRoute>
              }
            />

            <Route
              path="register"
              element={
                <RestrictedRoute redirectTo="/calculator">
                  <RegistrationPage />
                </RestrictedRoute>
              }
            />

            {/* 🔐 CALCULATOR*/}
            <Route
              path="calculator"
              element={
                <PrivateRoute>
                  <AuthCalculatorPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
