import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contacts from "./pages/contacts/Contacts";
import Projects from "./pages/projects/Projects";
import Blog from "./pages/blog/Blog";
import Auth from "./pages/auth/Auth";
import Page404 from "./pages/404/404";
import NewsDetailPage from "./pages/newsDetailPage/NewsDetailPage";

const AppRouter: React.FC = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route
                    path="/contacts"
                    element={<Contacts />}
                />
                <Route
                    path="/projects"
                    element={<Projects />}
                />
                <Route path="/blog/:id" element={<NewsDetailPage />} />
                <Route
                    path="/blog"
                    element={<Blog />}
                />
                <Route
                    path="/auth"
                    element={<Auth />}
                />
                <Route
                    path="/*"
                    element={< Page404 />}
                />
            </Routes>
        </>
    );
};

export default AppRouter;
