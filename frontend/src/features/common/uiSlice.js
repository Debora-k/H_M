import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastMessage: { message: "", status: "" },
  // 'success', 'error', 'warning'
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToastMessage(state, action) {
      state.toastMessage = {
        message: action.payload.message,
        status: action.payload.status,
      };
    },
    hideToastMessage(state) {
      state.open = false;
    },
  },
});

export const { showToastMessage, hideToastMessage } = uiSlice.actions;
export default uiSlice.reducer;
