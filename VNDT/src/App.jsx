import { Routes, Route } from "react-router-dom";
import IngredientList from "./pages/IngredientList";
import SupplierList from "./pages/SupplierList";
import StockManager from "./pages/StockManager";
import Statistics from "./pages/Statistics";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Notifications from "./pages/Notification";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Headerr";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import "./index.css";

function App() {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Chỉ hiển thị Header nếu người dùng đã đăng nhập */}
      {user && <Header />}

      <main className="flex-1 p-4">
        <Routes>
          {/* Trang đăng nhập */}
          <Route path="/login" element={<LoginPage />} />

          {/* Các route bảo vệ */}
          <Route path="/" element={<ProtectedRoute Component={HomePage} />} />
          <Route
            path="/ingredient"
            element={<ProtectedRoute Component={IngredientList} />}
          />
          <Route
            path="/supplier"
            element={<ProtectedRoute Component={SupplierList} />}
          />
          <Route
            path="/stock"
            element={<ProtectedRoute Component={StockManager} />}
          />
          <Route
            path="/stats"
            element={<ProtectedRoute Component={Statistics} />}
          />
          <Route
            path="/search"
            element={<ProtectedRoute Component={SearchPage} />}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute Component={Notifications} />}
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
}

export default App;
