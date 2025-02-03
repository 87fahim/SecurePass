import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from '../hooks/userAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    // console.log('roles: ', auth)
    const r = auth?.roles?.find(role => allowedRoles?.includes(role))
    console.log("User role is: ", r)
    // state: Allows you to pass extra information to the destination route when redirecting
    // from: location: Represents the current URL (or "route") the user is trying to access
    //replace: Ensures that the redirection does not add a new entry to the browser's history stack.
    // Without replace, the browser would add the redirect (e.g., /login) to the history stack, allowing the 
    // user to click "Back" and return to the protected page they were denied access to.
    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.username
                ? <Navigate to="/unauthrozed" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );

}

export default RequireAuth;