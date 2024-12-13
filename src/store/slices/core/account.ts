import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { USAGE_INTENT } from "src/config/constant";

type FirebaseUser = {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  uid: string;
};
type AccountState = {
  firebaseUser: FirebaseUser | null;
  onboardingData: any;
  user?: {
    based_in: string;
    content_category: string;
    cost: {
      post: string;
      reel: string;
      story: string;
    };
    currency: string;
    email: string;
    followers_count: string;
    instagram_id: string;
    name: string;
    phone: string;
    link: string;
    profileUrl?: string;
    description?: string;
    intent?: USAGE_INTENT;
  };
  initilized: boolean;
};

const initialState: AccountState = {
  firebaseUser: null,
  onboardingData: null,
  initilized: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateFirebaseUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.firebaseUser = action.payload;
    },
    saveOnboardingUserData: (state, action: PayloadAction<any | null>) => {
      state.onboardingData = action.payload;
    },
    updateUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
    },
    initilizeComplete: (state) => {
      state.initilized = true;
    },
  },
});

export const {
  updateFirebaseUser,
  saveOnboardingUserData,
  updateUser,
  initilizeComplete,
} = accountSlice.actions;

export default accountSlice.reducer;
