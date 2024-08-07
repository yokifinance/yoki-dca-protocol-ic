import "./App.css";
import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Main from "../Main/Main";

const App: React.FC = () => {
    return (
        <div className="page">
            <Header />
            <Main></Main>
            <Footer />
        </div>
    );
};

export default App;

// import React from "react";
// import LoggedOut from "../LoggedOut/LoggedOut";
// import LoggedIn from "../LoggedIn/LoggedIn";
// // import { useAuth, AuthProvider } from "./use-auth-client";
// import { useAuth, AuthProvider } from "../../utils/useAuthClient";
// import PlugWalletButton from "../PlugWalletButton/PlugWalletButton";

// // import "./assets/main.css";

// function App() {
//     const { isAuthenticated, identity } = useAuth();
//     return (
//         <>
//             <header id="header">
//                 <PlugWalletButton></PlugWalletButton>
//                 {/* <section id="status" className="toast hidden">
//                     <span id="content"></span>
//                     <button className="close-button" type="button">
//                         <svg
//                             aria-hidden="true"
//                             className="w-5 h-5"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                                 clipRule="evenodd"
//                             ></path>
//                         </svg>
//                     </button>
//                 </section> */}
//             </header>
//             {/* <main id="pageContent">{isAuthenticated ? <LoggedIn /> : <LoggedOut />}</main> */}
//         </>
//     );
// }

// export default () => (
//     <AuthProvider>
//         <App />
//     </AuthProvider>
// );
