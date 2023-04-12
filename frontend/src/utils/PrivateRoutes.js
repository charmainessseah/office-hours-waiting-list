import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../firebase';

const PrivateRoute = ({ children, ...rest }) => {
    return (
        auth.currentUser ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoute;