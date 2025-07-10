import React  from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Admin from "./components/Admin/Admin";
import Nav from "./components/Nav/Nav";
import Root from "./Root";


export default function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Switch>
                <Route path="/root" component={Root} />
                <Route path="/admin" component={Admin} />
            </Switch>

        </BrowserRouter>
    );
}