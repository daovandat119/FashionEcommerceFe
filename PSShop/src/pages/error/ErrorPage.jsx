import { Link } from 'react-router-dom';
import Headers from '../../components/headers/Headers';
import Footers from '../../components/footers/Footers';

const ErrorPage = () => {
  return (
    <>
      <Headers />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-20">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
          
          <h2 className="text-2xl md:text-3xl font-medium text-gray-700 mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            Vui lòng kiểm tra lại đường dẫn.
          </p>
          <Link
            to="/"
            className="inline-block bg-dark text-white px-8 py-3 rounded-lg
            hover:bg-opacity-90 transition-all duration-300"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
      <Footers />
    </>
  );
};

export default ErrorPage;