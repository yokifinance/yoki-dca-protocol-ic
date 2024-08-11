import "./App.css";
import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Main from "../Main/Main";
import { AuthProvider } from "../../context/AuthContext"; // Adjust the import path as necessary

const App: React.FC = () => {
    return (
        <div className="page">
            <Header />
            <AuthProvider>
                <Main />
            </AuthProvider>
            <Footer />
        </div>
    );
};

export default App;
