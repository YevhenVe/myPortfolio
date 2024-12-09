import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
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
                        <li onClick={() => { navigate("/"); setIsOpen(false); }}>Home</li>
                        <li onClick={() => { navigate("/about"); setIsOpen(false); }}>About</li>
                        <li onClick={() => { navigate("/contacts"); setIsOpen(false); }}>Contacts</li>
                        <li onClick={() => { navigate("/projects"); setIsOpen(false); }}>Projects</li>
                        <li onClick={() => { navigate("/blog"); setIsOpen(false); }}>Blog</li>
                        {user.uid ? <li onClick={handleToggle}>Theme</li> : ""}
                        <li onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                            {user.uid ? (
                                <>
                                    <span>{user.displayName?.split(' ')[0]}</span>
                                    <img
                                        className="avatar"
                                        src={user.photoURL ?? ''}
                                        alt={`${user.displayName}'s avatar`}
                                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                    />
                                </>
                            ) : (
                                <>Login</>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
