import React from "react";
import "./Footer.css";
import Logo from "../Logo/Logo";
import gitHubIcon from "../../images/github-mark-white.svg";
import xLogo from "../../images/x-logo.svg";
import openChatLogo from "../../images/spinner.svg";
import telegramLogo from "../../images/Telegram_logo.svg";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <ul className="footer__container">
                <li className="footer__column">
                    <Logo />
                    <p className="footer__description">Decentralized non-custodial payment automation protocol.</p>
                </li>
                <li className="footer__column">
                    <h4 className="footer__column-title">Docs</h4>
                    <ul className="footer__link-list">
                        <li className="footer__link">
                            <a
                                href="https://github.com/yokifinance/yoki-dca-protocol-ic"
                                target="_blank"
                                className="footer__link"
                            >
                                <img className="footer__link-icon" src={gitHubIcon} alt="Internet Identity" />
                                <span className="footer__link-description">GitHub</span>
                            </a>
                        </li>
                    </ul>
                </li>
                <li className="footer__column">
                    <h4 className="footer__column-title">Folow us</h4>
                    <ul className="footer__link-list">
                        <li className="footer__link">
                            <a
                                href="https://oc.app/favourite/group/a3kje-taaaa-aaaar-bjgtq-cai"
                                className="footer__link"
                                target="_blank"
                            >
                                <img className="footer__link-icon" src={openChatLogo} alt="Internet Identity" />
                                <span className="footer__link-description">OpenChat</span>
                            </a>
                        </li>
                        <li className="footer__link">
                            <a
                                href="https://github.com/yokifinance/yoki-dca-protocol-ic"
                                target="_blank"
                                className="footer__link"
                            >
                                <img className="footer__link-icon" src={telegramLogo} alt="Internet Identity" />
                                <span className="footer__link-description">Telegram</span>
                            </a>
                        </li>
                        <li className="footer__link">
                            <a href="https://x.com/icspore" target="_blank" className="footer__link">
                                <img className="footer__link-icon" src={xLogo} alt="Internet Identity" />
                                <span className="footer__link-description">x.com</span>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
