import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer"; // Ensure named import

const store = configureStore({
  reducer: {
    productState: productReducer, // Ensure this is a valid reducer
  },
});

export default store;
