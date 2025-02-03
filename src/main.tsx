import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import "./index.scss";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('SW registered'))
            .catch(error => console.log('SW failed:', error));
    });
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <App />
                <Footer />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
