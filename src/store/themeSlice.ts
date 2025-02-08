import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../Firebase';
import { ref, set, get } from "firebase/database";

// State typing
interface ThemeState {
    value: 'light' | 'dark';
}

const initialState: ThemeState = {
    value: 'light', // light theme by default
};

// Asynchronous operation to retrieve a topic from the database
export const fetchThemeFromDatabase = createAsyncThunk(
    'theme/fetchThemeFromDatabase',
    async (uid: string) => {
        const themeRef = ref(database, 'theme/' + uid + '/theme');
        const snapshot = await get(themeRef);
        return snapshot.exists() ? snapshot.val() : 'light'; // If your theme is not found, set it to 'light'
    }
);

// Change createAsyncThunk to accept an object with parameters
export const updateThemeInDatabase = createAsyncThunk(
  'theme/updateThemeInDatabase',
  async ({ uid, newTheme }: { uid: string, newTheme: 'light' | 'dark' }) => {
      const themeRef = ref(database, 'theme/' + uid + '/theme');
      await set(themeRef, newTheme); // Saving the theme in Firebase
  }
);

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state, action) => {
            state.value = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchThemeFromDatabase.fulfilled, (state, action) => {
                state.value = action.payload;
            })
            .addCase(updateThemeInDatabase.fulfilled, (state) => {
                // You can do something here if the topic has been successfully updated
            });
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
