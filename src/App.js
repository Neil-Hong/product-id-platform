import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import ManagePages from "./pages/managePage/ManagePages";
import HomePage from "./pages/homePage/HomePage";
import ErrorPage from "./pages/errorPage/ErrorPage";
import awsExports from "./aws-exports";
import "./style.scss";
import { Amplify } from "aws-amplify";

Amplify.configure(awsExports);
function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/manage/:id" element={<ManagePages />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
    );
}

export default App;
