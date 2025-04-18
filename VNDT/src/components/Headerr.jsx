import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBoxes,
  FaBuilding,
  FaExchangeAlt,
  FaChartBar,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { label: "Danh sách hàng hoá", icon: <FaBoxes />, path: "/" },
  {
    label: "Danh sách nhà cung cấp",
    icon: <FaBuilding />,
    path: "/supplierlist",
  },
  { label: "Quản lý nhập - xuất kho", icon: <FaExchangeAlt />, path: "/stock" },
  { label: "Thống kê, cảnh báo", icon: <FaChartBar />, path: "/stats" },
  { label: "Thông báo", icon: <FaBell />, path: "/notifications" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Nút menu 3 gạch luôn hiển thị */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 text-white bg-cyan-600 hover:bg-cyan-700 rounded-full p-2 shadow-lg focus:outline-none"
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-teal-500 via-cyan-600 to-indigo-700 text-white h-screen pt-16 pb-6 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } shadow-lg flex flex-col justify-between fixed z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div
            className={`bg-yellow-300 rounded-full shadow-lg p-2 transition-all duration-300 ${
              isOpen ? "w-20 h-20" : "w-14 h-14"
            } flex items-center justify-center`}
          >
            <img
              src="https://res.cloudinary.com/dkzpfo8b2/image/upload/v1744819280/logo_fgovjl.png"
              alt="Logo cá nhân"
              className={`transition-all duration-300 ${
                isOpen ? "w-16 h-16" : "w-10 h-10"
              } rounded-full`}
            />
          </div>
        </div>

        {/* Chào người dùng */}
        {/* Chào người dùng */}
        <div className="flex items-center justify-center mb-6 px-2">
          {isOpen ? (
            <div className="flex items-center gap-2 bg-cyan-600 rounded-lg px-3 py-2 text-white transition-all duration-300">
              <span className="font-semibold text-xl">Xin chào</span>
              <span className="font-semibold text-xl">
                {user?.username || "Người dùng"}
              </span>
            </div>
          ) : (
            <div className="bg-cyan-600 rounded-full p-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1144/1144760.png"
                alt="User icon"
                className="w-8 h-8"
              />
            </div>
          )}
        </div>

        {/* Menu */}
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

      {/* Main content với khoảng trống bên trái để tránh bị che */}
      <div
        className={`flex-1 p-8 bg-gray-100 min-h-screen transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Nội dung sẽ được render qua <Routes /> */}
      </div>
    </div>
  );
};

export default Header;
