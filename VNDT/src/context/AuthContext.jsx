import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Lưu thông tin người dùng
    localStorage.setItem("user", JSON.stringify(userData)); // Lưu thông tin vào localStorage (tuỳ chọn)
  };

  const logout = () => {
    setUser(null); // Đặt user về null khi đăng xuất
    localStorage.removeItem("user"); // Xoá thông tin người dùng khỏi localStorage (tuỳ chọn)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
