import React from "react";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const MainPage = React.lazy(() => import("../pages/MainPage/MainPage"));
// Lazy-loaded Sayfalar
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Login ve Register */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
