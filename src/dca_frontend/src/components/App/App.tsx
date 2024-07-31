import "./App.css";
import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Main from "../Main/Main";
import AuthComponent from "../AuthComponent/AuthComponent";

const App: React.FC = () => {
    return (
        <div className="page">
            <Header />
            <AuthComponent />
            <Main></Main>
            <Footer />
        </div>
    );
};

export default App;
