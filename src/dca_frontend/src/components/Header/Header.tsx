import React from "react";
import "./Header.css";
import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header_container">
                <Logo></Logo>
                <NavLink></NavLink>
            </div>
        </header>
    );
};

export default Header;
