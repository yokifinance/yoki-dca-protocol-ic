import React from "react";
import logo from "../../images/logo.svg";
import "./Logo.css";

const Logo: React.FC = () => {
    return <img className="logo" src={logo} alt="Логотип IC-Spores" />;
};

export default Logo;
