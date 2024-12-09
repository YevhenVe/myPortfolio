import React from "react";
import { auth, googleProvider, database } from "../../../Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleTheme } from '../../store/themeSlice';

const Auth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            if (user) {
                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL,
                };
                navigate("/");
                // Saving user data in Redux
                dispatch(setUser(userData));
                // Recording user data in Realtime Database
                await set(ref(database, `users/${user.uid}`), userData);
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(clearUser());
            dispatch(toggleTheme('light')); // Can reset the theme to default (light) if needed
            navigate("/"); // Navigating to the login page
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <div className="body-wrapper">
            <h1>Auth</h1>
            {user.uid && <div className="info-box">
                <div className="info-left"><p><img src={user.photoURL ?? ''} alt="" /></p></div>
                <div className="info-right"><p>Name: {user.displayName}</p></div>
                <div className="info-left"><p>Email: {user.email}</p></div>
                <div className="info-left"><p>UID: {user.uid}</p></div>

            </div>}
            {user.uid ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogin}>Login with Google</button>}
        </div>
    );
};

export default Auth;
