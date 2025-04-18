import React, { useState } from "react";
import { X } from "lucide-react";
import { FaBell } from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "✅ Thêm sản phẩm mới thành công" },
    { id: 2, message: "🏢 Đã thêm nhà cung cấp mới" },
    { id: 3, message: "📦 Xuất kho sản phẩm: Bánh Mì" },
  ]);

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-cyan-600 text-2xl" />
        <h1 className="text-3xl font-bold text-cyan-700">Thông báo hệ thống</h1>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Không có thông báo nào.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow hover:shadow-md transition-all"
            >
              <span className="text-gray-800 text-base">{n.message}</span>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
