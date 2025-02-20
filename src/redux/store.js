// store.js
import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./reducers/customerReducers";
import customerCountsReducer from "../../src/redux/slices/customerCountsSlice";
import employeeReducer from "./reducers/employeeReducers";

const store = configureStore({
  reducer: {
    customers: customerReducer,
    customerCounts: customerCountsReducer,
    employees: employeeReducer,
  },
});

export default store;
