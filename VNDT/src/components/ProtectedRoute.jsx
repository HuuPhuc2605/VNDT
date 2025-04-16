import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Đảm bảo bạn sử dụng đúng đường dẫn

const ProtectedRoute = ({ Component, ...rest }) => {
  const { user } = useAuth(); // Kiểm tra người dùng đã đăng nhập hay chưa
  const location = useLocation();

  if (!user) {
    // Nếu không có user, chuyển hướng đến trang login và lưu lại vị trí hiện tại
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Nếu có user, hiển thị component và truyền lại props (nếu có)
  return <Component {...rest} />;
};

export default ProtectedRoute;
