import { useEffect, useState } from 'react';
import { auth, googleProvider, database } from "../../../Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, set, get } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../store/userSlice";
import { RootState } from '../../store/store';
import { toggleTheme } from '../../store/themeSlice';
import Button from "../../components/button/Button";
import "./Auth.scss";

interface UserData {
    displayName: string;
    email: string;
    uid: string;
    photoURL: string;
    role: string;
}

const Auth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState<UserData[]>([]);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedInUser = result.user;
            if (loggedInUser) {
                const userRef = ref(database, `users/${loggedInUser.uid}`);
                const snapshot = await get(userRef);
                let userData;
                if (snapshot.exists()) {
                    userData = snapshot.val(); //pull user data from database
                } else {
                    userData = {
                        displayName: loggedInUser.displayName,
                        email: loggedInUser.email,
                        uid: loggedInUser.uid,
                        photoURL: loggedInUser.photoURL,
                        role: "user",
                    };
                    await set(ref(database, `users/${loggedInUser.uid}`), userData); //push user data to database
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

    // Add function to fetch all users
    const fetchAllUsers = async () => {
        if (user.role === 'admin') {
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const users = Object.values(snapshot.val()) as UserData[];
                setAllUsers(users);
            }
        }
    };

    // Add function to toggle user role
    const handleRoleToggle = async (uid: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await set(ref(database, `users/${uid}/role`), newRole);
        await fetchAllUsers(); // Refresh the users list
    };

    useEffect(() => {
        fetchAllUsers();
    }, [user.role]);

    return (
        <div className="body-wrapper auth">
            <div className="user_page_section">
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
            {/* Add Users Management Section for Admins */}
            <div className="user-role-section">
                {user.role === 'admin' && (
                    <div className="users-management">
                        <h2>Users Management</h2>
                        <div className="users-list">
                            {allUsers.map((userData) => (
                                <div key={userData.uid} className="user-item">
                                    <img
                                        className="user-pic-small"
                                        src={userData.photoURL}
                                        alt=""
                                    />
                                    <span><b>Name: </b>{userData.displayName}</span>
                                    <span><b>Email:</b> {userData.email}</span>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={userData.role === 'admin'}
                                            onChange={() => handleRoleToggle(userData.uid, userData.role)}
                                            disabled={userData.uid === user.uid && userData.role === "admin"} // Disable toggle for self if admin
                                        />
                                        <span className="role-label">
                                            {userData.role}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;