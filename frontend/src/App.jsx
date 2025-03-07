import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserRegisterPage from "./assets/Nikhil/UserRegistrationPage";
import LoginPage from "./assets/Nikhil/LoginPage";
import ProductListingPage from "./assets/Nikhil/ProductListingPage";
import MapPage from "./pages/MapPage";

import Layout from "./layout";
import Landingpage from "./pages/Landingpage";
import FarmerProfilePage from "./assets/Nikhil/FarmerProfilePage";
import ProductShowPage from "./assets/Nikhil/ProductShowPage";
import ProductDetailPage from "./assets/Nikhil/ProductDetailPage";
import CustomerRegister from "./assets/Nikhil/customerRegister";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerLogin from "./pages/FarmerLogin";

const App = () => {
    return (
        <Router>
            {/* <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<UserRegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/product-listing" element={<ProductListingPage />} />
            </Routes> */}

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Landingpage />} />
                    {/* <Route path="/register" element={<UserRegisterPage />} />
                    <Route path="/login" element={<LoginPage />} /> */}
                    <Route
                        path="/product-listing"
                        element={<ProductListingPage />}
                    />
                    <Route path="/profile" element={<FarmerProfilePage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/product-show" element={<ProductShowPage />} />
                    <Route
                        path="/product-detail/:id"
                        element={<ProductDetailPage />}
                    />
                    <Route path="/farmer/login" element={<LoginPage />} />
                    <Route
                        path="/farmer/register"
                        element={<UserRegisterPage />}
                    />
                    <Route
                        path="/customer/register"
                        element={<CustomerRegister />}
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
