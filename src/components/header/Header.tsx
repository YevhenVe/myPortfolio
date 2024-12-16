import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import CustomButton from "../button/Button";
import { toggleTheme, updateThemeInDatabase, fetchThemeFromDatabase } from '../../store/themeSlice';
import "./Header.scss";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    const theme = useSelector((state: RootState) => state.theme.value); // Get the string value of the topic
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>(); // Typing dispatch as AppDispatch

    const toggleMenu = () => setIsOpen(!isOpen);

    // Load a theme from Firebase when mounting a component
    useEffect(() => {
        if (user.uid) {
            dispatch(fetchThemeFromDatabase(user.uid)); // Loading a theme from the database
        }
    }, [dispatch, user.uid]);

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        if (user.uid) {
            dispatch(toggleTheme(newTheme)); // Changing the theme in Redux
            dispatch(updateThemeInDatabase({ uid: user.uid, newTheme })); // Saving the theme in Firebase
        }
    };

    return (
        <div className="header-wrapper">
            <div className="header-content-wrapper">
                <div className="logo" onClick={() => navigate("/")}>YV</div>
                <div className="links">
                    <div className="burger-wrapper" onClick={toggleMenu}>
                        <div className={`burger ${isOpen ? "open" : ""}`}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <ul className={`links-box ${isOpen ? "open" : ""}`}>
                        <li>
                            <CustomButton label="Home" onClick={() => { navigate("/"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                        </li>
                        <li>
                            <CustomButton label="About" onClick={() => { navigate("/about"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                        </li>
                        <li>
                            <CustomButton label="Contacts" onClick={() => { navigate("/contacts"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                        </li>
                        <li>
                            <CustomButton label="Projects" onClick={() => { navigate("/projects"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                        </li>
                        <li>
                            <CustomButton label="Blog" onClick={() => { navigate("/blog"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                        </li>
                        {user.uid && <li><CustomButton label="Theme" onClick={handleToggle} imageLeft="" imageRight={""} /></li>}
                        <li>
                            {user.uid ? (
                                <CustomButton label={user.displayName!.split(' ')[0]} onClick={() => { navigate("/auth"); setIsOpen(false); }} imageLeft="" imageRight={user.photoURL ?? ''} />

                            ) : (
                                <CustomButton label="Login" onClick={() => { navigate("/auth"); setIsOpen(false); }} imageLeft="" imageRight={""} />
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
