import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxes,
  FaPlusCircle,
  FaExchangeAlt,
  FaChartBar,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Đảm bảo bạn sử dụng đúng đường dẫn

const menuItems = [
  { label: "Danh sách hàng hoá", icon: <FaBoxes />, path: "/" },
  { label: "Thêm/Sửa/Xoá hàng hoá", icon: <FaPlusCircle />, path: "/form" },
  { label: "Quản lý nhập - xuất kho", icon: <FaExchangeAlt />, path: "/stock" },
  { label: "Thống kê, cảnh báo", icon: <FaChartBar />, path: "/stats" },
  { label: "Tìm kiếm, lọc hàng hoá", icon: <FaSearch />, path: "/search" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Lấy hàm logout và user từ context

  const handleLogout = () => {
    logout(); // Đăng xuất người dùng
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-teal-500 via-cyan-600 to-indigo-700 text-white h-screen p-6 transition-all duration-300 ${
          isOpen ? "w-64" : "w-36"
        } shadow-lg flex flex-col justify-between`}
      >
        {/* Toggle Button */}
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-2xl font-semibold tracking-wider text-yellow-300 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Quản lý kho
          </h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-yellow-300 focus:outline-none"
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Tên tài khoản */}
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-2 bg-cyan-600 rounded-lg p-2 text-white">
            <span className="font-semibold text-lg">Xin chào</span>

            <span className="font-semibold text-lg ">
              {user?.username || "Người dùng"}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="space-y-6 flex-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-md font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-yellow-500 text-black"
                      : "hover:bg-cyan-700 hover:text-yellow-300"
                  }`
                }
              >
                <span className="text-2xl">{item.icon}</span>
                {isOpen && (
                  <span className="text-lg text-white">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Đăng xuất */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-md font-medium transition-colors duration-300 hover:bg-cyan-700 hover:text-yellow-300 w-full"
          >
            <FaSignOutAlt size={20} />
            {isOpen && <span className="text-lg text-white">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {/* Content will be rendered via Routes */}
      </div>
    </div>
  );
};

export default Header;
