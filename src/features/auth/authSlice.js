import { async } from "@firebase/util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import auth from "../../firebase/firebase.config";

const initialState = {
  user: { email: "", role: "" },
  isLoading: true,
  isError: false,
  error: "",
};

// asyncThunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password }) => {
    const data = await createUserWithEmailAndPassword(auth, email, password);
    console.log(data.user.email);
    return data.user.email;
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    const data = await signInWithEmailAndPassword(auth, email, password);
    console.log(data.user.email);
    return data.user.email;
  }
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async () => {
    const googleProvider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data.user.email);
    return data.user.email;
  }
);

export const getUser = createAsyncThunk("auth/getUser", async (email) => {
  const res = await fetch(`${process.env.REACT_APP_DEV_API}/user/${email}`);
  const data = await res.json();

  if (data.status) {
    return data;
  }

  return email;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // redux email state empty for signout
    signout: (state) => {
      state.user.email = "";
    },
    // subscribed user
    subscribedUser: (state, action) => {
      state.user.email = action.payload;
      state.isLoading = false;
    },
    // toggleLoading
    toggleLoading: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user.email = payload;
        state.isError = false;
        state.error = "";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user.email = "";
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = true;
        state.user.email = action.payload;
        state.isError = false;
        state.error = "";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user.email = "";
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.email = action.payload;
        state.isError = false;
        state.error = "";
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user.email = "";
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.user = action.payload.data;
        } else {
          state.user = action.payload;
        }

        state.isError = false;
        state.error = "";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = "";
        state.isError = true;
        state.error = action.error.message;
      });
  },
});

export const { signout, subscribedUser, toggleLoading } = authSlice.actions;
export default createSlice.reducers;
