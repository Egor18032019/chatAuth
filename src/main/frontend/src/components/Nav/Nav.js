import React from 'react';
import { NavLink } from "react-router-dom";
import data from './link.json';
import styles from './Nav.css';


const Links = (links) => {

    return (
        <div className="cards-menu">
            {data.links.map((link) => {

                return (
                    <div key={link.href} className="card-link">
                        <NavLink to={link.href} className="card-link">
                            {link.label}
                        </NavLink>
                    </div>
                )
            })}
        </div>
    )
};

export default function Nav() {
    return (
        <div className="navi">
            <div className="logo-container">
                <span>Интерактивный электронный журнал общего строительного контроля </span>
            </div>

            <Links links={data} />
        </div>
    )
}


