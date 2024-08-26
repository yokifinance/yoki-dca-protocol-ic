import React from "react";
import "./FormContainer.css";

interface FormContainerProps {
    children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return <section className="form-container">{children}</section>;
};

export default FormContainer;
