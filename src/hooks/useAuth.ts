import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Firebase";
import { setUser, clearUser } from "../store/userSlice";

export const useAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(
                    setUser({
                        displayName: user.displayName,
                        email: user.email,
                        uid: user.uid,
                        photoURL: user.photoURL,
                        role: user.email === "eugene.veprytskyi@gmail.com" ? "admin" : "user",
                    })
                );
            } else {
                dispatch(clearUser());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);
};
