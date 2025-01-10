import { auth, googleProvider, database } from "../../../Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, set, get } from "firebase/database"; // Імпортуємо get
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice"; // Імпортуємо setUser
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
            const loggedInUser = result.user;
            if (loggedInUser) {
                const userRef = ref(database, `users/${loggedInUser.uid}`);
                const snapshot = await get(userRef);

                let userData;
                if (snapshot.exists()) {
                    userData = snapshot.val();
                } else {
                    userData = {
                        displayName: loggedInUser.displayName,
                        email: loggedInUser.email,
                        uid: loggedInUser.uid,
                        photoURL: loggedInUser.photoURL,
                        role: "user",
                    };
                    await set(ref(database, `users/${loggedInUser.uid}`), userData);
                }

                navigate("/");
                dispatch(setUser(userData));
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
        <>
            <div className="body-wrapper auth">
                <h1>User page</h1>
                {user.uid && (
                    <div className="info-box">
                        <div className="info-left">
                            <img className="user-pic" src={user.photoURL ?? ''} alt="" />
                        </div>
                        <div className="info-right">
                            <p><b>Name:</b> {user.displayName}</p>
                            {user.role === "admin" && <p><b>Role:</b> {user.role}</p>}
                        </div>
                        <div className="info-left">
                            <p><b>Email:</b> {user.email}</p>
                        </div>
                        <div className="info-left">
                            <p><b>UID:</b> {user.uid}</p>
                        </div>
                    </div>
                )}
                {user.uid ? (
                    <Button label="Logout" onClick={handleLogout} imageRight="" imageLeft="" />
                ) : (
                    <Button label="Login with Google" onClick={handleLogin} imageRight="" imageLeft="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/150px-Google_%22G%22_logo.svg.png" />
                )}
            </div>
        </>
    );
};

export default Auth;