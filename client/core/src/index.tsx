import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./website/App";
import React from "react";
import ConnectedIntlProvider from "./shared/intl";
import { Provider } from "react-redux";
import store from "./shared/store";
import "react-toastify/dist/ReactToastify.css";
import { initToast } from "./shared/toast";
import { setHostUrl } from "./shared/fetch";
import { initStorage } from "./shared/storage";
import storageWrapper from "./website/components/storage";
import { SET_LOCALE } from "./actions/common";
import ToastWrapper from "./website/components/ToastWrapper";
import "./website/css/no-iframe.css";
import moment from "moment";
import "moment/locale/zh-cn";

// Add necessary configurations here before rendering

// Set host url for HTTP requests
setHostUrl(window.location.origin);

// Initialize language
store.dispatch({
    type: SET_LOCALE,
    locale: navigator.language
});
moment.locale(navigator.language);

// Initialize toast provider
initToast(new ToastWrapper(store));

// Initialize local storage provider
initStorage(storageWrapper);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedIntlProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConnectedIntlProvider>
    </Provider>,
    document.getElementById("root")
);