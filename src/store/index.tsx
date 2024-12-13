import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/core/account";
import productReducer from "./slices/influ/product";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    product: productReducer,
  },
  devTools: true,
});

// Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()));

// Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented());
// // {value: 1}
// store.dispatch(incremented());
// // {value: 2}
// store.dispatch(decremented());
// {value: 1}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
