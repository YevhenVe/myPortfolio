import { useAuth } from "./hooks/useAuth";
import AppRouter from "./AppRouter";
import { useTheme } from "./hooks/useTheme";
import "./styles/theme.scss"
import "./App.scss";

function App() {
    useAuth();
    useTheme();

    return <AppRouter />;
}

export default App;
