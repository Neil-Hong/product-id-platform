import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterPage from "./pages/registerPage/RegisterPage";
import ManagePages from "./pages/managePage/ManagePages";
import HomePage from "./pages/homePage/HomePage";
import ErrorPage from "./pages/errorPage/ErrorPage";
import awsExports from "./aws-exports";
import "./style.scss";
import { Amplify } from "aws-amplify";
import { useSelector } from "react-redux";
import Loading from "./components/Loading";
import PrivateRoute from "./PrivateRoute";

Amplify.configure(awsExports);
function App() {
    const loading = useSelector((state) => state.product.loading);
    const checkLogin = useSelector((state) => state.user.loggedIn);

    return (
        <div className="app">
            {loading ? <Loading /> : null}
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/manage/:id"
                        element={
                            <PrivateRoute isAuthenticated={checkLogin}>
                                <ManagePages />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
    );
}

export default App;
