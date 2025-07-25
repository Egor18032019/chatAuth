import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from "./components/Admin/Admin";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Work from "./components/Work/Work";


export default function App() {

    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/work" element={<Work />} />
                <Route path="/admin" element={<Admin />} />

            </Routes>
        </BrowserRouter>

    );
}