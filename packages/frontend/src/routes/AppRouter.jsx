import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const MainPage = React.lazy(() => import("../pages/MainPage/MainPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);

// Calculator
const AuthCalculatorPage = React.lazy(() =>
  import("../pages/AuthCalculatorPage/AuthCalculatorPage")
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* ⭐ Calculator Page Route */}
          <Route path="/calculator" element={<AuthCalculatorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
