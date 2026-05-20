import React, { useState } from 'react';
import ContactForm from '../../components/contactForm/ContactForm';
import Button from '../../components/button/Button';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import HeroImage from '../../assets/heroimage.jpg';
import './Home.scss';

const Home: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const links = {
        link1: "https://drive.google.com/file/d/1r6rnUU4VfikQfqnNdVY8G7WOPJ3tF37M/view?usp=drive_link",
    };

    const handleClickLinkOne = (link: string) => {
        window.open(link, "_blank");
    };

    return (
        <>
            <div className="body-wrapper">
                <div className="introduction-wrapper">
                    <div className="introduction-left">
                        <div className="introduction">
                            <p className="greeting">Hello, I'm</p>
                            <p className="name">Yevhen Veprytskyi</p>
                            <p className="position">Frontend engineer</p>
                            <div className="button-box">
                                <Button 
                                    label="HIRE ME" 
                                    onClick={() => setOpenModal(true)} 
                                    className="hire-button" 
                                    imageRight="" 
                                    imageLeft="" 
                                />
                                <Button 
                                    label="DOWNLOAD CV" 
                                    onClick={() => handleClickLinkOne(links.link1)} 
                                    className="cv-button" 
                                    imageRight="" 
                                    imageLeft="" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="introduction-right">
                        <img 
                            className="introduction-pic" 
                            src={HeroImage} 
                            alt="Yevhen Veprytskyi - Frontend Engineer" 
                        />
                    </div>
                </div>
            </div>
            {openModal && (
                <ModalWindow onClick={() => setOpenModal(false)}>
                    <ContactForm />
                </ModalWindow>
            )}
        </>
    );
};

export default Home;
