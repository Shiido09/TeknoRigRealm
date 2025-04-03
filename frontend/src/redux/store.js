import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./reducers/productReducer";
import { 
  orderCreateReducer, 
  orderDetailsReducer, 
  orderListMyReducer,
  adminOrdersReducer 
} from "./reducers/orderReducers";

const store = configureStore({
  reducer: {
    productState: productReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderListMy: orderListMyReducer,
    adminOrders: adminOrdersReducer, 
  },
});

export default store;