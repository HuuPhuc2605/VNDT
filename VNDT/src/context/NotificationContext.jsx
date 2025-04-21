"use client"

import { createContext, useContext, useState, useEffect } from "react"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // Khôi phục thông báo từ localStorage khi khởi động
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (error) {
        console.error("Error parsing notifications from localStorage", error)
      }
    }
  }, [])

  // Lưu thông báo vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (message, type = "info", category = "", customId = null) => {
    const newNotification = {
      id: customId || `${category || "notification"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      category,
      time: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => {
      // Kiểm tra xem ID đã tồn tại chưa
      const exists = prev.some((n) => n.id === newNotification.id)
      if (exists) {
        // Nếu ID đã tồn tại, tạo ID mới
        newNotification.id = `${category || "notification"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      return [newNotification, ...prev]
    })

    return newNotification.id
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
