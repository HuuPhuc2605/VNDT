// main.jsx hoặc index.jsx
import React from "react";
import ReactDOM from "react-dom/client"; // Chú ý import từ 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Đảm bảo AuthProvider đã được import đúng

// Tạo root và render ứng dụng
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <AuthProvider>
      {" "}
      {/* Bao bọc toàn bộ ứng dụng bằng AuthProvider */}
      <App />
    </AuthProvider>
  </Router>
);
