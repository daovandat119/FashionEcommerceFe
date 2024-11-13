import React, { useContext } from 'react';
import { LoginContext } from './LoginContext';

const GoogleLogin = () => {
    const { googleLogin } = useContext(LoginContext);

    const handleGoogleLogin = () => {
        googleLogin();
    };

    return (
        <div className="text-center">
            <button className="btn btn-danger" onClick={handleGoogleLogin}>
                Đăng Nhập Bằng Google
            </button>
        </div>
    );
};

export default GoogleLogin;