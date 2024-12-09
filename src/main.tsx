import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from "./components/header/Header";
import App from "./App";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
