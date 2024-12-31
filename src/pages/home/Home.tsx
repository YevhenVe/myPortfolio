import React, { useState } from 'react';
import ContactForm from '../../components/contactForm/ContactForm';
import Button from '../../components/button/Button';
import ModalWindow from '../../components/modalWindow/ModalWindow';
import './Home.scss';

const Home: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const links = {
        link1: "https://docs.google.com/document/d/e/2PACX-1vR_gsdL1Ao3Av8lFDPEhj0O0QcCS98duY3rjyemjT4vKMBA_4GfUIzi6xGxTAsd-_4qHBPwvTMHB3st/pub",
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
                            <p className='greeting'>hello i`m</p>
                            <p className='name'>Yevhen Veprytskyi</p>
                            <p className='position'>Frontend engeneer</p>
                            <div className="button-box">
                                <Button label="HIRE ME" onClick={() => setOpenModal(!openModal)} className="hire-button" imageRight="" imageLeft="" />
                                <Button label="DOVNLOAD CV" onClick={() => handleClickLinkOne(links.link1)} className="cv-button" imageRight="" imageLeft="" />
                            </div>

                        </div>
                    </div>
                    <div className="introduction-right">
                        <img className="introduction-pic" src="https://lh3.google.com/u/0/d/1doF3P4ziDRBlex55o_O6EX7lEoVnESen=w1920-h1049-iv1" alt="" />
                    </div>
                </div>
            </div>
            {openModal &&
                <ModalWindow onClick={() => setOpenModal(!openModal)}>
                    <ContactForm />
                </ModalWindow>}
        </>
    );
};

export default Home;
