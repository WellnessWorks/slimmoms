import React from "react";
import css from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.headerWrapper}>
        {/*Logo*/}
        <div className={css.headerText}>
          <Link to="/login" className="header-text">
            LOG IN
          </Link>
          <Link to="/register" className="header-text">
            REGISTRATION
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;