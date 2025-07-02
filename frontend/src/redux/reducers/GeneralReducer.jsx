import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavbarOpen: true,
  userId: null
};
const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    handleNavbar: (state) => {
      state.isNavbarOpen = !state.isNavbarOpen;
    },
    loginUser: (state, actions) => {
      // state.userId = actions.payload.userId;
    }
  },
});

export const {
    handleNavbar,
    loginUser
} = generalSlice.actions;

export default generalSlice.reducer;