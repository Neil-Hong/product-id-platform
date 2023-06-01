import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSlice from "./users/userSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import productSlice from "./users/productSlice";

const persistConfig = {
    key: "root",
    storage,
    whiteList: ["user"],
    blacklist: ["product"],
};
const rootReducers = combineReducers({ user: userSlice, product: productSlice });
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);

export default { store, persistor };
