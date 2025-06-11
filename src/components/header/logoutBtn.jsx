import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
    const dispatch = useDispatch();

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        });
    };

    return (
        <button
            onClick={logoutHandler}
            className="px-5 py-2 text-white transition-colors bg-orange-600 rounded-full hover:bg-orange-500"
        >
            Logout
        </button>
    );
}

export default LogoutBtn;
