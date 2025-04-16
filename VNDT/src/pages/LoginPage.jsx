import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123456") {
      login({ username });
      navigate("/"); // Chuyển hướng tới trang chủ sau khi đăng nhập thành công
    } else {
      alert("Sai thông tin đăng nhập");
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-teal-500 via-cyan-600 to-indigo-700">
      {/* Background Image for the warehouse */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://res.cloudinary.com/dkzpfo8b2/image/upload/v1744806504/nen_m3rrvc.png")',
        }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
      {/* Lớp phủ mờ */}
      {/* Login Box */}
      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold text-center text-cyan-700 mb-8">
            Đăng nhập hệ thống
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-cyan-700 font-medium mb-2 text-lg">
                Tên đăng nhập
              </label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-cyan-700 font-medium mb-2 text-lg">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 text-lg"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
