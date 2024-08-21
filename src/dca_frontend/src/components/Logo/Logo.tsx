import React from "react";
import logo from "../../images/Logo_icspore_1.png";
import "./Logo.css";

const Logo: React.FC = () => {
    return <img className="logo" src={logo} alt="Логотип IC-Spores" />;
};

export default Logo;
