import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    displayName: string | null;
    email: string | null;
    uid: string | null;
    photoURL: string | null;
    role: "admin" | "user" | null;
}

const initialState: UserState = {
    displayName: null,
    email: null,
    uid: null,
    photoURL: null,
    role: null,

};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.displayName = action.payload.displayName;
            state.email = action.payload.email;
            state.uid = action.payload.uid;
            state.photoURL = action.payload.photoURL;
            state.role = action.payload.role;
        },
        clearUser(state) {
            state.displayName = null;
            state.email = null;
            state.uid = null;
            state.photoURL = null;
            state.role = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
