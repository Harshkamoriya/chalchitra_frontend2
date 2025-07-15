'use client';
import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { useSocket } from '@/app/(nav2)/context/SocketContext';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
};

const NotificationDropdown = ({ isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);
  const { notifications, markNotificationAsRead, deleteNotification } = useSocket();
  const isMobile = useIsMobile();
  const {unreadCount} = useSocket();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) markNotificationAsRead(notification._id);
    if (notification.actionUrl) window.open(notification.actionUrl, '_blank');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'message': return '💬';
      case 'payment': return '💰';
      case 'rating': return '⭐';
      default: return '🔔';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={isMobile
        ? "fixed inset-0 bg-white z-50 flex flex-col"
        : "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <span className="font-medium text-sm text-gray-900">{notification.title}</span>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markNotificationAsRead(notification._id)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      {notification.actionUrl && (
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button className="w-full text-center text-purple-600 hover:text-purple-800 text-sm font-medium">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
