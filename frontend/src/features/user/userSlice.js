import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try{
      const response = await api.post("/auth/login", {email, password});
      // success
      // Login page
      // saving token in session storage
      sessionStorage.setItem("token", response.data.token);

      return response.data;
    } catch(error) {
      // failed
      // error info saves in reducer
      return rejectWithValue(error.error);
    }
  }
);

// export const loginWithGoogle = createAsyncThunk(
//   "user/loginWithGoogle",
//   async (token, { rejectWithValue }) => {}
// );

export const logout = () => (dispatch) => {};
export const registerUser = createAsyncThunk(
  "user/registerUser", // the action's name
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try{
      // calling api, post: creating a new user
      const response = await api.post("/user", {email, name, password})
      // after success: displaying a message and redirect to login page
      // calling the action from uiSlice.js
      dispatch(showToastMessage({message:"Congrats for signing up!", status:"success"}))
      navigate("/login");
      // Axios -> data & want to send this to data field
      return response.data.data;

    }catch(error){
      // after fail: displaying a message and saving the error
      dispatch(showToastMessage({message:"Sorry, sign up process failed.", status:"error"}));
      // the 'error' is from backend userController and that has 'error' message to bring here
      return rejectWithValue(error.error);

    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try{
      const response = await api.get("/user/me");
      return response.data;
    } catch(error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  //reducers helps to call values directly
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  //extraReducers helps to call things from other functions
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    })
    //fulfilled means success
    .addCase(registerUser.fulfilled, (state) => {
      //after loading is done in fulfilled 
      state.loading = false;
      //if there's an error while registration then set up the value as null
      state.registrationError = null;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.registrationError = action.payload;
    })
    .addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginWithEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.loginError = null;
    })
    .addCase(loginWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.loginError = action.payload;
    })
    // no pending for loginWithToken cause after that will be displayed items
    .addCase(loginWithToken.fulfilled, (state, action) => {
      state.user = action.payload.user;
    });
    // Also, if there's no valid token then just display the login page (therefore, no rejected)
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
