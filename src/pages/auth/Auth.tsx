import { auth, googleProvider, database } from "../../../Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, set } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../store/userSlice";
import { RootState } from '../../store/store';
import { toggleTheme } from '../../store/themeSlice';
import Button from "../../components/button/Button";
import "./Auth.scss";

const Auth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            if (user) {
                const isAdmin = user.email === "eugene.veprytskyi@gmail.com";
                // Set the user data
                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL,
                    role: isAdmin ? "admin" : "user",
                };
                navigate("/");
                // Record the user in the Realtime Database
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
            dispatch(toggleTheme('light'));
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <div className="body-wrapper auth">
            <h1>User page</h1>
            {user.uid && (
                <div className="info-box">
                    <div className="info-left">
                        <img className="user-pic" src={user.photoURL ?? ''} alt="" />
                    </div>
                    <div className="info-right">
                        <p>Name: {user.displayName}</p>
                        {user.role === "admin" && <p>Role: {user.role}</p>}
                    </div>
                    <div className="info-left">
                        <p>Email: {user.email}</p>
                    </div>
                    <div className="info-left">
                        <p>UID: {user.uid}</p>
                    </div>
                </div>
            )}
            {user.uid ? (
                <Button label="Logout" onClick={handleLogout} imageRight="" imageLeft="" />
            ) : (
                <Button label="Login with Google" onClick={handleLogin} imageRight="" imageLeft="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/150px-Google_%22G%22_logo.svg.png" />
            )}
        </div>
    );
};

export default Auth;
