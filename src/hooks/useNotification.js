import { useState, useCallback } from 'react';

let notificationId = 0;

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  // 添加通知
  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      autoClose: true,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  // 移除通知
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // 清除所有通知
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 便捷方法
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options,
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // 错误消息显示更久
      ...options,
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 6000,
      ...options,
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options,
    });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };
};

export default useNotification; 