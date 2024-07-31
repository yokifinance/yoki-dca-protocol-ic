import React from "react";
import "./Footer.css";
import Logo from "../Logo/Logo";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__column">
                    <Logo></Logo>
                    <p className="footer__description">Decentralized non-custodial payment automation protocol.</p>
                </div>
                <div className="footer__column">
                    <h4 className="footer__heading">ABOUT</h4>
                    <ul className="footer__list">
                        <li>
                            <a
                                href="https://docs.yoki.finance/docs/introduction/what-is-yoki-finance"
                                className="footer__link"
                            >
                                Docs
                            </a>
                        </li>
                        <li>
                            <a href="https://yokifinance.medium.com/" className="footer__link">
                                Blog
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__column">
                    <h4 className="footer__heading">COMPANY</h4>
                    <ul className="footer__list">
                        <li>
                            <a href="https://forms.gle/s2vSfvCQr1UuJEEJ9" className="footer__link">
                                Business Integrations
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://drive.google.com/drive/folders/1NBeZfIE1rtXvo70MIvEkrR2Yq_ZcQmJ4?usp=sharing"
                                className="footer__link"
                            >
                                Brand Assets
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__column">
                    <h4 className="footer__heading">FOLLOW US</h4>
                    <ul className="footer__social-list">
                        <li>
                            <a href="https://www.youtube.com/@yoki_finance" className="footer__social-link">
                                YouTube
                            </a>
                        </li>
                        <li>
                            <a href="https://discord.com/invite/sZMZZnwyxC" className="footer__social-link">
                                Discord
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/yokifinance" className="footer__social-link">
                                Twitter
                            </a>
                        </li>
                        <li>
                            <a href="https://yokifinance.medium.com/" className="footer__social-link">
                                Medium
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
