import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import rootStore from "./redux/store";
import App from "./App";
import {} from "stylis-plugin-rtl";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Provider store={rootStore.store}>
            <PersistGate persistor={rootStore.persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
