import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../Pages/Home/Home";
import Aboutus from "../Pages/Aboutus/Aboutus";
import Contactus from "../Pages/Contactus/Contactus";
import MenuScreen from "../Pages/MenuScreen/MenuScreen";
import Feed from "../Pages/Feed/FeedScreen";
import CustomOrder from "../Pages/CustomOrder/CustomOrder";
import Cart from "../Pages/Cart/Cart";
import MenuProduct from "../Pages/MenuProduct/MenuProductDetail";

export default function Navigation() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<Aboutus />} />
        <Route path="/contact-us" element={<Contactus />} />
        <Route path="/menu-screen" element={<MenuScreen />} />
        <Route path="/CreatePizza" element={<Feed />} />
        <Route path="/CustomOrder" element={<CustomOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu-product" element={<MenuProduct />} />
        {/* <Route path="/feed/:id" element={<Feed />} /> */}
        {/* <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/dashboard" element={<DashHome />} />
        <Route path="/college" element={<College />} />
        <Route path="/college/:collegeId" element={<CollegeDetail />} /> */}
      </Routes>
    </Router>
  );
}
