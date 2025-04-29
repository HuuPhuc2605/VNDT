"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Bell, Info, AlertTriangle, CheckCircle, XCircle, Filter, RefreshCw, Trash2 } from "lucide-react"
import { FaBell, FaBoxOpen, FaServer, FaShieldAlt } from "react-icons/fa"
import { useNotifications } from "../context/NotificationContext"
import axios from "axios"
import toast from "react-hot-toast"

const Notifications = () => {
  const { notifications, removeNotification, addNotification, clearAllNotifications } = useNotifications()
  const [allNotifications, setAllNotifications] = useState([])
  const [filter, setFilter] = useState("all")
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [samplesAdded, setSamplesAdded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState(null)

  // Tạo một bản đồ để theo dõi các thông báo đã tồn tại
  const [notificationMap, setNotificationMap] = useState(new Map())

  // Hàm để tạo ID thông báo nhất quán
  const createConsistentId = (type, category, productId = null, action = null) => {
    // Tạo ID nhất quán cho các loại thông báo khác nhau
    if (type === "low-stock" && productId) {
      return `inventory-low-${productId}`
    } else if (type === "stock-change" && productId && action) {
      return `inventory-${action}-${productId}`
    } else if (type === "system-check") {
      return `system-inventory-check`
    } else {
      // Fallback to a unique ID if no consistent pattern applies
      return `${category}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  // Hàm kiểm tra và thêm thông báo, tránh trùng lặp
  const safeAddNotification = useCallback(
    (message, type, category, idType, productId = null, action = null) => {
      const consistentId = createConsistentId(idType, category, productId, action)

      // Kiểm tra xem thông báo tương tự đã tồn tại chưa
      const existingNotification = notifications.find((n) => n.id === consistentId)

      if (!existingNotification) {
        // Nếu chưa tồn tại, thêm mới
        addNotification(message, type, category, consistentId)
      } else {
        // Nếu đã tồn tại, chỉ cập nhật nếu nội dung khác
        if (existingNotification.message !== message) {
          // Xóa thông báo cũ và thêm thông báo mới
          removeNotification(consistentId)
          addNotification(message, type, category, consistentId)
        }
      }
    },
    [notifications, addNotification, removeNotification],
  )

  const fetchIngredients = useCallback(
    async (isManualRefresh = false) => {
      setIsRefreshing(true)
      try {
        const response = await axios.get("https://67fa743d8ee14a542627bf04.mockapi.io/Lab6/VNDT")
        const ingredients = response.data

        // Check for low stock items based on minStockLevel
        const lowStockItems = ingredients.filter((item) => {
          // Get the minStockLevel from the API or use default value of 10
          const minStockLevel = item.minStockLevel ? Number.parseInt(item.minStockLevel) : 10
          return Number.parseInt(item.quantity) < minStockLevel
        })

        // Add notifications for low stock items
        lowStockItems.forEach((item) => {
          const minStockLevel = item.minStockLevel ? Number.parseInt(item.minStockLevel) : 10

          // Determine severity based on how far below minimum level
          const currentQuantity = Number.parseInt(item.quantity)
          let notificationType = "warning"
          let message = ""

          if (currentQuantity <= 0) {
            notificationType = "error"
            message = `Sản phẩm '${item.name}' đã hết hàng! Cần nhập thêm gấp.`
          } else if (currentQuantity < minStockLevel * 0.5) {
            notificationType = "error"
            message = `Sản phẩm '${item.name}' sắp hết hàng (còn ${item.quantity} ${item.unit}, dưới 50% mức tối thiểu ${minStockLevel}).`
          } else {
            message = `Sản phẩm '${item.name}' dưới mức tồn kho tối thiểu (còn ${item.quantity} ${item.unit}, mức tối thiểu ${minStockLevel}).`
          }

          safeAddNotification(message, notificationType, "inventory", "low-stock", item.id)
        })

        // Add system notification about checking inventory
        if (lowStockItems.length > 0) {
          safeAddNotification(
            `Đã phát hiện ${lowStockItems.length} sản phẩm dưới mức tồn kho tối thiểu. Vui lòng kiểm tra kho.`,
            "info",
            "system",
            "system-check",
          )
        } else {
          safeAddNotification(
            "Kiểm tra kho hàng hoàn tất. Tất cả sản phẩm đều trên mức tồn kho tối thiểu.",
            "success",
            "system",
            "system-check",
          )
        }

        // Cập nhật thời gian làm mới cuối cùng
        setLastRefreshTime(new Date())

        return ingredients
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
        safeAddNotification("Không thể kết nối đến máy chủ để kiểm tra kho hàng.", "error", "system", "system-error")
        return []
      } finally {
        setIsRefreshing(false)
      }
    },
    [safeAddNotification],
  )

  // Thêm mẫu thông báo khi component được tải
  useEffect(() => {
    const previousDataRef = { current: [] }

    const checkForChanges = async () => {
      const ingredients = await fetchIngredients()

      // Check for changes if we have previous data
      if (previousDataRef.current.length > 0 && ingredients.length > 0) {
        detectChanges(previousDataRef.current, ingredients)
      }

      // Store current data for next comparison
      previousDataRef.current = ingredients
    }

    // Function to detect changes between previous and current data
    const detectChanges = (prevData, currentData) => {
      // Create maps for easier lookup
      const prevMap = new Map(prevData.map((item) => [item.id, item]))
      const currentMap = new Map(currentData.map((item) => [item.id, item]))

      // Check for added or modified items
      currentData.forEach((item) => {
        const prevItem = prevMap.get(item.id)

        if (!prevItem) {
          // New item added
          safeAddNotification(
            `Sản phẩm mới '${item.name}' đã được thêm vào kho.`,
            "success",
            "inventory",
            "stock-change",
            item.id,
            "added",
          )
        } else {
          // Check for modifications
          if (item.quantity !== prevItem.quantity) {
            const diff = Number(item.quantity) - Number(prevItem.quantity)
            const action = diff > 0 ? "nhập thêm" : "xuất"
            safeAddNotification(
              `Sản phẩm '${item.name}' đã được ${action} ${Math.abs(diff)} ${item.unit}. Số lượng hiện tại: ${item.quantity} ${item.unit}.`,
              "info",
              "inventory",
              "stock-change",
              item.id,
              action,
            )
          }

          if (item.name !== prevItem.name) {
            safeAddNotification(
              `Sản phẩm '${prevItem.name}' đã được đổi tên thành '${item.name}'.`,
              "info",
              "inventory",
              "stock-change",
              item.id,
              "renamed",
            )
          }

          if (item.supplier !== prevItem.supplier) {
            safeAddNotification(
              `Nhà cung cấp của sản phẩm '${item.name}' đã thay đổi từ '${prevItem.supplier}' thành '${item.supplier}'.`,
              "info",
              "inventory",
              "stock-change",
              item.id,
              "supplier-changed",
            )
          }

          // Check if minStockLevel was changed
          if (item.minStockLevel !== prevItem.minStockLevel) {
            const oldLevel = prevItem.minStockLevel || "10 (mặc định)"
            const newLevel = item.minStockLevel || "10 (mặc định)"
            safeAddNotification(
              `Mức tồn kho tối thiểu của sản phẩm '${item.name}' đã thay đổi từ ${oldLevel} thành ${newLevel}.`,
              "info",
              "inventory",
              "stock-change",
              item.id,
              "minstock-changed",
            )
          }
        }
      })

      // Check for deleted items
      prevData.forEach((item) => {
        if (!currentMap.has(item.id)) {
          safeAddNotification(
            `Sản phẩm '${item.name}' đã bị xóa khỏi kho.`,
            "error",
            "inventory",
            "stock-change",
            item.id,
            "deleted",
          )
        }
      })
    }

    // Initial fetch
    if (!samplesAdded) {
      checkForChanges()
      setSamplesAdded(true)
    }

    // Set up polling to check for changes every 30 seconds
    const intervalId = setInterval(checkForChanges, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [fetchIngredients, safeAddNotification, samplesAdded])

  // Hàm làm mới thủ công - xóa tất cả thông báo cũ và kiểm tra lại
  const handleRefresh = async () => {
    // Xóa tất cả thông báo hiện tại
    clearAllNotifications()

    // Hiển thị thông báo toast
    toast.success("Đã xóa tất cả thông báo cũ và đang kiểm tra lại...", {
      duration: 2000,
      position: "top-center",
    })

    // Fetch dữ liệu mới
    await fetchIngredients(true)

    // Thông báo hoàn tất
    toast.success("Đã làm mới thông báo thành công!", {
      duration: 2000,
      position: "top-center",
    })
  }

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

  // Format thời gian làm mới cuối cùng
  const formatLastRefreshTime = () => {
    if (!lastRefreshTime) return "Chưa làm mới"

    return lastRefreshTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast container */}
      <div id="toast-container" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBell className="text-cyan-600 text-2xl" />
          <h1 className="text-3xl font-bold text-cyan-700">Thông báo hệ thống</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Thời gian làm mới cuối cùng */}
          <div className="text-sm text-gray-500">Cập nhật lúc: {formatLastRefreshTime()}</div>

          {/* Nút làm mới */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all ${
              isRefreshing ? "opacity-70 cursor-not-allowed" : ""
            }`}
            title="Xóa tất cả thông báo cũ và kiểm tra lại"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Đang làm mới..." : "Làm mới"}</span>
          </button>

          {/* Nút xóa tất cả */}
          <button
            onClick={() => {
              clearAllNotifications()
              toast.success("Đã xóa tất cả thông báo", {
                duration: 2000,
                position: "top-center",
              })
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
            title="Xóa tất cả thông báo"
          >
            <Trash2 size={18} />
            <span>Xóa tất cả</span>
          </button>

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
                    className={`w-full text-left px-3 py-2 rounded ${
                      filter === "all" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    Tất cả thông báo
                  </button>
                  <button
                    onClick={() => {
                      setFilter("info")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "info" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <Info size={16} className="text-blue-500" /> Thông tin
                  </button>
                  <button
                    onClick={() => {
                      setFilter("warning")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "warning" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <AlertTriangle size={16} className="text-yellow-500" /> Cảnh báo
                  </button>
                  <button
                    onClick={() => {
                      setFilter("success")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "success" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <CheckCircle size={16} className="text-green-500" /> Thành công
                  </button>
                  <button
                    onClick={() => {
                      setFilter("error")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "error" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <XCircle size={16} className="text-red-500" /> Lỗi
                  </button>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={() => {
                      setFilter("system")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "system" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <FaServer size={16} className="text-purple-500" /> Hệ thống
                  </button>
                  <button
                    onClick={() => {
                      setFilter("inventory")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "inventory" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <FaBoxOpen size={16} className="text-orange-500" /> Kho hàng
                  </button>
                  <button
                    onClick={() => {
                      setFilter("security")
                      setShowFilterMenu(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                      filter === "security" ? "bg-cyan-100 text-cyan-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <FaShieldAlt size={16} className="text-red-500" /> Bảo mật
                  </button>
                </div>
              </div>
            )}
          </div>
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
              className={`flex items-start justify-between ${getNotificationBg(n.type, n.read)} ${getNotificationBorder(
                n.type,
              )} p-4 rounded-lg shadow hover:shadow-md transition-all`}
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
                  <p className="text-gray-800 text-base">
                    {typeof n.message === "string"
                      ? n.message
                      : typeof n.message === "object" && n.message.message
                        ? n.message.message
                        : JSON.stringify(n.message)}
                  </p>
                </div>
              </div>
              <button onClick={() => removeNotification(n.id)} className="text-red-500 hover:text-red-700 ml-2">
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
