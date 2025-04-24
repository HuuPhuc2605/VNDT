"use client";

import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Khôi phục từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing notifications:", err);
      }
    }
  }, []);

  // Lưu vào localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (
    message,
    type = "info",
    category = "",
    customId = null
  ) => {
    // ✅ Xử lý an toàn cho message: object → chuỗi
    let safeMessage = message;

    if (typeof message === "object") {
      if (message.message && typeof message.message === "string") {
        safeMessage = message.message;
        if (message.type) type = message.type;
      } else {
        safeMessage = JSON.stringify(message); // fallback
      }
    }

    const newNotification = {
      id:
        customId ||
        `${category || "notification"}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      message: safeMessage,
      type,
      category,
      time: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) {
        newNotification.id = `${
          category || "notification"
        }-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      return [newNotification, ...prev];
    });

    return newNotification.id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

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
  );
};

export const useNotifications = () => useContext(NotificationContext);
