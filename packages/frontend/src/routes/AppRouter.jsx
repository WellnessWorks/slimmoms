import React from "react";
import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
          {/* Login ve Register */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
