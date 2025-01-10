import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../../Firebase";
import { ref, get } from "firebase/database";
import { setUser, clearUser } from "../store/userSlice";

export const useAuth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = ref(database, `users/${user.uid}`);
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        dispatch(
                            setUser({
                                displayName: user.displayName,
                                email: user.email,
                                uid: user.uid,
                                photoURL: user.photoURL,
                                role: userData?.role || "user",
                            })
                        );
                    } else {
                        console.log("User data not found in Realtime Database");
                        dispatch(clearUser());
                    }
                } catch (error) {
                    console.error("Error fetching user data from Realtime Database:", error);
                    dispatch(clearUser());
                }
            } else {
                dispatch(clearUser());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);
};