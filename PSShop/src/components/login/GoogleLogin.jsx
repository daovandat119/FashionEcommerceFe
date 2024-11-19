import { useContext } from 'react';
import { LoginContext } from './LoginContext';
import { FcGoogle } from 'react-icons/fc';

const GoogleLogin = () => {
    const { googleLogin } = useContext(LoginContext);

    const handleGoogleLogin = () => {
        googleLogin();
    };

    return (
        <div className="text-center">
            <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
                <FcGoogle className="w-6 h-6" />
                <span className="text-base">Đăng Nhập Bằng Google</span>
            </button>
        </div>
    );
};

export default GoogleLogin;