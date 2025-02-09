import React, { useState } from "react";
import CookieConsent from "react-cookie-consent";
import "./CookieConsent.scss";
import ModalWindow from "../modalWindow/ModalWindow";

declare global {
    interface Window {
        gtag: (command: string, eventName: string, params: { [key: string]: string | number | boolean }) => void;
    }
}

const CookieBanner = () => {
    const [loadMoreCookies, setLoadMoreCookies] = useState(false);

    return (
        <>
            <CookieConsent
                location="bottom"
                buttonText="cookie_accept"
                declineButtonText="cookie_decline"
                enableDeclineButton
                flipButtons
                cookieName="userConsent"
                style={{ background: "#2B373B" }}
                buttonStyle={{ background: "#14a7d0", color: "white", fontSize: "14px" }}
                declineButtonStyle={{ background: "transparent", color: "white", border: "1px solid" }}
                expires={365}
                onAccept={() => {
                    try {
                        window.gtag("consent", "update", { analytics_storage: "granted" });
                    } catch (error) {
                        console.error("Error when calling gtag:", error);
                    }
                }}
                onDecline={() => {
                    document.cookie = "userConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                }}
            >
                <div className="learn-more-cookies-button" style={{ color: "white", marginLeft: "5px" }}>
                    <p onClick={() => setLoadMoreCookies(!loadMoreCookies)} >"learn more about cookies"</p>
                </div>
            </CookieConsent>
            {loadMoreCookies && <ModalWindow onClick={() => setLoadMoreCookies(!loadMoreCookies)}>
                <div className={`learn-more-cookies ${loadMoreCookies ? "show" : ""}`}>
                    <p>Our website utilizes cookies to ensure optimal functionality and to enhance user experience. Cookies are small data files stored on your device that may contain non-personally identifiable information, which we use for performance analysis, content personalization, and to facilitate essential website operations. By continuing to use this website, you hereby consent to the placement of cookies in accordance with applicable legal requirements and our Cookie Policy. </p>
                </div>
            </ModalWindow>}
        </>
    );
};

export default CookieBanner;