import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userSlice from "./users/userSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
    key: "root",
    storage,
    whiteList: ["user"],
};
const rootReducers = combineReducers({ user: userSlice });
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = configureStore({ reducer: persistedReducer });
const persistor = persistStore(store);

export default { store, persistor };
