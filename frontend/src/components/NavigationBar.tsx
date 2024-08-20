import React from 'react';
import {Link} from "react-router-dom";

import {useAuth} from "../App";

const NavigationBar: React.FC = () => {
    const auth = useAuth();

    return (
            <nav>
                <h1><Link to="/">HealtyBoi</Link></h1>
                <div>
                    {auth.user ? (
                        <Link to="/logout">Log Out</Link>
                    ) :  (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </nav>
    );
}

export default NavigationBar;
