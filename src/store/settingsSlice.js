import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  language: localStorage.getItem("i18nextLng") || "ru",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("i18nextLng", action.payload);
    },
  },
});

export const { toggleTheme, setLanguage } = settingsSlice.actions;

export const selectTheme = (state) => state.settings.theme;
export const selectLanguage = (state) => state.settings.language;

export default settingsSlice.reducer;
