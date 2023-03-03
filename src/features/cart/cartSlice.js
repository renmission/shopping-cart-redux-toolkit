import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import cartItems from "../../cartItems";
import axios from 'axios';

const url = "http://localhost:3000/products";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk("cart/getCartItems", async (name, thunkAPI) => {
  try {
    console.log(thunkAPI.getState());
    const res = await axios(url);
    return res.data;
  } catch (error) {
    console.log(error);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      const index = state.cartItems.findIndex((item) => item.id === itemId);
      state.cartItems = [
        ...state.cartItems.slice(0, index),
        ...state.cartItems.slice(index + 1),
      ];
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      const { cartItems } = state;
      const { amount, total } = cartItems.reduce(
        (accumulator, item) => {
          const { amount, price } = item;
          accumulator.amount += amount;
          accumulator.total += amount * price;
          return accumulator;
        },
        { amount: 0, total: 0 }
      );
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
        state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, { payload }) => {
        state.isLoading = false;
        state.cartItems = payload;
    },
    [getCartItems.rejected]: (state) => {
        state.isLoading = false;
    },
  },
});

// console.log(cartSlice);

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
