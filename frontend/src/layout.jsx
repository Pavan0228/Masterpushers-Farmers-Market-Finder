import { React, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import TopBar from "@/components/common/topbar";
// import Toaster from 'react-hot-toast';
function Layout() {
    return (
        <>
            <TopBar />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default Layout;
