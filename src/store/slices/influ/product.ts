import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ProductsState = {
  products: any;
};

const initialState: ProductsState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<any[] | null>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;

export default productSlice.reducer;
