import React from "react";
import "./Contacts.scss";
import ContactForm from "../../components/contactForm/ContactForm";

const Contacts: React.FC = () => {
    return (
        <div className="body-wrapper">
            <div className="contacts-wrapper">
                <h1>Contacts</h1>
                <div className="contacts-content">
                    <p><b>Phone: </b><a href="tel:+17738440498">+1(773)844.04.98</a></p>
                    <p><b>Email: </b><a href="mailto:eugene.veprytskyi@gmail.com">eugene.veprytskyi@gmail.com</a></p>
                </div>
                <div className="contacts-social">
                    <p><b>My social networks:</b></p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/eugeneveprytskyi" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 112.196 112.196" xmlSpace="preserve" className=""><g><circle cx="56.098" cy="56.098" r="56.098" fill="#000" data-original="#3b5998" className=""></circle><path d="M70.201 58.294h-10.01v36.672H45.025V58.294h-7.213V45.406h7.213v-8.34c0-5.964 2.833-15.303 15.301-15.303l11.234.047v12.51h-8.151c-1.337 0-3.217.668-3.217 3.513v7.585h11.334l-1.325 12.876z" data-original="#ffffff" className=""></path></g></svg>
                        </a>
                        <a href="https://x.com/YevhenVe" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 1227 1227" xmlSpace="preserve" className=""><g><path d="M613.5 0C274.685 0 0 274.685 0 613.5S274.685 1227 613.5 1227 1227 952.315 1227 613.5 952.315 0 613.5 0z" fill="#000000" opacity="1" data-original="#000000" className=""></path><path d="m680.617 557.98 262.632-305.288h-62.235L652.97 517.77 470.833 252.692H260.759l275.427 400.844-275.427 320.142h62.239l240.82-279.931 192.35 279.931h210.074L680.601 557.98zM345.423 299.545h95.595l440.024 629.411h-95.595z" opacity="1" data-original="#ffffff" className=""></path></g></svg>
                        </a>
                        <a href="https://github.com/YevhenVe" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" xmlSpace="preserve" className=""><g><path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z" fill="#000000" opacity="1" data-original="#000000" className=""></path></g></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/yevhenve/" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 512 512" xmlSpace="preserve" className=""><g><path d="M256 0C114.637 0 0 114.637 0 256s114.637 256 256 256 256-114.637 256-256S397.363 0 256 0zm-74.39 387h-62.348V199.426h62.347zm-31.173-213.188h-.406c-20.922 0-34.453-14.402-34.453-32.402 0-18.406 13.945-32.41 35.274-32.41 21.328 0 34.453 14.004 34.859 32.41 0 18-13.531 32.403-35.274 32.403zM406.423 387h-62.34V286.652c0-25.218-9.027-42.418-31.586-42.418-17.223 0-27.48 11.602-31.988 22.801-1.649 4.008-2.051 9.61-2.051 15.215V387h-62.344s.817-169.977 0-187.574h62.344v26.558c8.285-12.78 23.11-30.96 56.188-30.96 41.02 0 71.777 26.808 71.777 84.421zm0 0" fill="#000000" opacity="1" data-original="#000000" className=""></path></g></svg>
                        </a>
                    </div>
                </div>
                <div className="contact-form-wrapper">
                    <ContactForm />
                </div>
            </div>
        </div >
    );
};

export default Contacts;
