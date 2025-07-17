import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from "./components/Admin/Admin";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Chat from "./components/Chat/Chat";


export default function App() {

    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/chat" element={<Chat />} />
                <Route path="/admin" element={<Admin />} />

            </Routes>
        </BrowserRouter>

    );
}