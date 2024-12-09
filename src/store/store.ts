import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import themeReducer from './themeSlice';
import { ThunkAction } from 'redux-thunk'; 
import { Action } from 'redux';

export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
    },
});

// Type for the `rootState`
export type RootState = ReturnType<typeof store.getState>;

// Type for the `dispatch`
export type AppDispatch = typeof store.dispatch;

// Type for async actions (thunk)
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
