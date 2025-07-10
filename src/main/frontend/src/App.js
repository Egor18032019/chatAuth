import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from "./components/Admin/Admin";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Root from "./Root";


export default function App() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [email, setEmail] = useState('')
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />}></Route>
                <Route path="/root" element={<Root/>} />
                <Route path="/admin" element={<Admin/>} />

            </Routes>

        </BrowserRouter>
    );
}