import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import css from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={css.layout}>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
