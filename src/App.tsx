import { useAuth } from "./hooks/useAuth";
import AppRouter from "./AppRouter";
import { useTheme } from "./hooks/useTheme";
import { ToastContainer } from 'react-toastify';
import "./styles/theme.scss"
import "./App.scss";

function App() {
    useAuth();
    useTheme();

    return <>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} /></>;
}

export default App;
