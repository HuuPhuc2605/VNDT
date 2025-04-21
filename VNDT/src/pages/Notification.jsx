"use client"

import { useState, useEffect } from "react"
import { X, Bell, Info, AlertTriangle, CheckCircle, XCircle, Filter } from "lucide-react"
import { FaBell, FaBoxOpen, FaServer, FaShieldAlt } from "react-icons/fa"
import { useNotifications } from "../context/NotificationContext"

// Mẫu thông báo hệ thống với ID duy nhất
const sampleNotifications = [
  {
    id: "system-1001",
    type: "info",
    message: "Hệ thống vừa được cập nhật lên phiên bản 2.3.0",
    time: "2023-11-15T08:30:00",
    read: false,
    category: "system",
  },
  {
    id: "system-1002",
    type: "success",
    message: "Sao lưu dữ liệu tự động hoàn tất thành công",
    time: "2023-11-14T23:45:00",
    read: true,
    category: "system",
  },
  {
    id: "inventory-1003",
    type: "warning",
    message: "Sản phẩm 'Loa Bluetooth JBL Charge 5' sắp hết hàng (còn 10 chiếc)",
    time: "2023-11-14T14:20:00",
    read: false,
    category: "inventory",
  },
  {
    id: "inventory-1004",
    type: "error",
    message: "Sản phẩm 'Loa Bluetooth JBL Charge 4' đã hết",
    time: "2023-11-14T10:15:00",
    read: false,
    category: "inventory",
  },
  {
    id: "security-1005",
    type: "info",
    message: "Đăng nhập mới từ thiết bị lạ - IP: 192.168.1.45",
    time: "2023-11-13T16:30:00",
    read: true,
    category: "security",
  },
  {
    id: "system-1006",
    type: "success",
    message: "Kết nối với máy chủ dữ liệu thành công",
    time: "2023-11-13T09:10:00",
    read: true,
    category: "system",
  },
  {
    id: "inventory-1007",
    type: "warning",
    message: "Sản phẩm '	Smartwatch Samsung Galaxy Watch 5' sắp hết (còn 15 chiếc)",
    time: "2023-11-12T11:45:00",
    read: true,
    category: "inventory",
  },
  {
    id: "security-1008",
    type: "error",
    message: "Phát hiện nhiều lần đăng nhập thất bại liên tiếp",
    time: "2023-11-11T22:30:00",
    read: false,
    category: "security",
  },
]

const Notifications = () => {
  const { notifications, removeNotification, addNotification } = useNotifications()
  const [allNotifications, setAllNotifications] = useState([])
  const [filter, setFilter] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [samplesAdded, setSamplesAdded] = useState(false)

  // Thêm mẫu thông báo khi component được tải
  useEffect(() => {
    // Chỉ thêm mẫu thông báo một lần và nếu chưa có thông báo nào
    if (notifications.length === 0 && !samplesAdded) {
      sampleNotifications.forEach((notification) => {
        addNotification(notification.message, notification.type, notification.category, notification.id)
      })
      setSamplesAdded(true)
    }
  }, [addNotification, notifications.length, samplesAdded])

  // Kết hợp thông báo từ context và mẫu thông báo
  useEffect(() => {
    // Tạo một bản sao của mảng thông báo để tránh thay đổi trực tiếp
    const combinedNotifications = [...notifications]

    // Sắp xếp theo thời gian, mới nhất lên đầu
    combinedNotifications.sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : Date.now()
      const timeB = b.time ? new Date(b.time).getTime() : Date.now()
      return timeB - timeA
    })

    setAllNotifications(combinedNotifications)
  }, [notifications])

  // Lọc thông báo theo loại
  const filteredNotifications = allNotifications.filter((notification) => {
    if (filter === "all") return true
    return notification.type === filter || notification.category === filter
  })

  // Định dạng thời gian
  const formatTime = (timeString) => {
    if (!timeString) return "Vừa xong"

    const notificationTime = new Date(timeString)
    const now = new Date()
    const diffMs = now - notificationTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return notificationTime.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Icon cho từng loại thông báo
  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="text-blue-500" size={20} />
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />
      case "success":
        return <CheckCircle className="text-green-500" size={20} />
      case "error":
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Bell className="text-gray-500" size={20} />
    }
  }

  // Icon cho từng danh mục
  const getCategoryIcon = (category) => {
    switch (category) {
      case "system":
        return <FaServer className="text-purple-500" />
      case "inventory":
        return <FaBoxOpen className="text-orange-500" />
      case "security":
        return <FaShieldAlt className="text-red-500" />
      default:
        return <FaBell className="text-gray-500" />
    }
  }

  // Màu nền cho từng loại thông báo
  const getNotificationBg = (type, read) => {
    if (read) return "bg-white"

    switch (type) {
      case "info":
        return "bg-blue-50"
      case "warning":
        return "bg-yellow-50"
      case "success":
        return "bg-green-50"
      case "error":
        return "bg-red-50"
      default:
        return "bg-gray-50"
    }
  }

  // Màu viền cho từng loại thông báo
  const getNotificationBorder = (type) => {
    switch (type) {
      case "info":
        return "border-l-4 border-blue-500"
      case "warning":
        return "border-l-4 border-yellow-500"
      case "success":
        return "border-l-4 border-green-500"
      case "error":
        return "border-l-4 border-red-500"
      default:
        return "border-l-4 border-gray-300"
    }
  }

  // Tạo ID duy nhất cho thông báo mới
  const generateUniqueId = (prefix) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBell className="text-cyan-600 text-2xl" />
          <h1 className="text-3xl font-bold text-cyan-700">Thông báo hệ thống</h1>
        </div>

        {/* Bộ lọc */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-50"
          >
            <Filter size={18} />
            <span>Lọc</span>
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              <div className="p-2">
                <button
                  onClick={() => {
                    setFilter("all")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded ${filter === "all" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  Tất cả thông báo
                </button>
                <button
                  onClick={() => {
                    setFilter("info")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "info" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <Info size={16} className="text-blue-500" /> Thông tin
                </button>
                <button
                  onClick={() => {
                    setFilter("warning")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "warning" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <AlertTriangle size={16} className="text-yellow-500" /> Cảnh báo
                </button>
                <button
                  onClick={() => {
                    setFilter("success")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "success" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <CheckCircle size={16} className="text-green-500" /> Thành công
                </button>
                <button
                  onClick={() => {
                    setFilter("error")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "error" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <XCircle size={16} className="text-red-500" /> Lỗi
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={() => {
                    setFilter("system")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "system" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <FaServer size={16} className="text-purple-500" /> Hệ thống
                </button>
                <button
                  onClick={() => {
                    setFilter("inventory")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "inventory" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <FaBoxOpen size={16} className="text-orange-500" /> Kho hàng
                </button>
                <button
                  onClick={() => {
                    setFilter("security")
                    setShowFilterMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${filter === "security" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"}`}
                >
                  <FaShieldAlt size={16} className="text-red-500" /> Bảo mật
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Bell size={64} className="mb-4 opacity-30" />
          <p className="text-xl">Không có thông báo nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between ${getNotificationBg(n.type, n.read)} ${getNotificationBorder(n.type)} p-4 rounded-lg shadow hover:shadow-md transition-all`}
            >
              <div className="flex gap-3">
                <div className="mt-1">{getNotificationIcon(n.type)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {n.category && (
                      <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {getCategoryIcon(n.category)}
                        <span>
                          {n.category === "system" && "Hệ thống"}
                          {n.category === "inventory" && "Kho hàng"}
                          {n.category === "security" && "Bảo mật"}
                        </span>
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{formatTime(n.time)}</span>
                  </div>
                  <p className="text-gray-800 text-base">{n.message}</p>
                </div>
              </div>
              <button onClick={() => removeNotification(n.id)} className="text-red-500 hover:text-red-700 ml-2">
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Thêm thông báo mới (chỉ để demo) */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-cyan-700">Tạo thông báo mới (Demo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() =>
              addNotification(
                "Hệ thống đã được cập nhật lên phiên bản mới nhất",
                "info",
                "system",
                generateUniqueId("system"),
              )
            }
            className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-3 rounded-lg hover:bg-blue-200"
          >
            <Info size={18} /> Thông báo cập nhật hệ thống
          </button>
          <button
            onClick={() =>
              addNotification(
                "Phát hiện sản phẩm sắp hết hàng trong kho",
                "warning",
                "inventory",
                generateUniqueId("inventory"),
              )
            }
            className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 p-3 rounded-lg hover:bg-yellow-200"
          >
            <AlertTriangle size={18} /> Cảnh báo hàng tồn kho
          </button>
          <button
            onClick={() =>
              addNotification("Sao lưu dữ liệu tự động hoàn tất", "success", "system", generateUniqueId("system"))
            }
            className="flex items-center justify-center gap-2 bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200"
          >
            <CheckCircle size={18} /> Thông báo thành công
          </button>
          <button
            onClick={() =>
              addNotification(
                "Phát hiện đăng nhập bất thường vào hệ thống",
                "error",
                "security",
                generateUniqueId("security"),
              )
            }
            className="flex items-center justify-center gap-2 bg-red-100 text-red-700 p-3 rounded-lg hover:bg-red-200"
          >
            <XCircle size={18} /> Cảnh báo bảo mật
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notifications
