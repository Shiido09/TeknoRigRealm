import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";
import { 
  orderCreateReducer, 
  orderDetailsReducer, 
  orderListMyReducer 
} from "./reducers/orderReducers";

const store = configureStore({
  reducer: {
    productState: productReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderListMy: orderListMyReducer,
  },
});

export default store;
