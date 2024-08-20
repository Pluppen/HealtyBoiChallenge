import {useEffect} from "react";
import { Navigate } from "react-router-dom";
import {useAuth} from "./App";


const Logout = () => {
    const auth = useAuth();

    useEffect(() => {
        auth.signout();
    }, []);

    return (
        <Navigate to="/login" />
    );
}

export default Logout;
