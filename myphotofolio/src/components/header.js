import React from "react";
import logo from "../assets/logo.png";
import "../styles/header.css"
const HeaderMain = () => {
  return (
    <>
      <div className="headerCont">
        <a href="/"><img className="hedicon" src={logo} alt="Header Logo" width="50" height="50" /> </a>
        <h3>PhotoFolio</h3>
      </div>
    </>
  );
};

export default HeaderMain;
