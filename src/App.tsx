import { useAuth } from "./hooks/useAuth";
import AppRouter from "./AppRouter";
import { useTheme } from "./hooks/useTheme";
import OfflinePage from "./pages/offlinePage/OfflinePage";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { ToastContainer } from 'react-toastify';
import "./styles/theme.scss"
import "./App.scss";

function App() {
    useAuth();
    useTheme();
    const { isOnline, checkNetwork } = useNetworkStatus();

    return <>
        {!isOnline ? (
            <OfflinePage onRetry={checkNetwork} />
        ) : (
            <>
                <AppRouter />
                <ToastContainer position="top-right" autoClose={3000} /></>
        )}
    </>;
}

export default App;
