import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    displayName: string | null;
    email: string | null;
    uid: string | null;
    photoURL: string | null;
}

const initialState: UserState = {
    displayName: null,
    email: null,
    uid: null,
    photoURL: null,
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
        },
        clearUser(state) {
            state.displayName = null;
            state.email = null;
            state.uid = null;
            state.photoURL = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
