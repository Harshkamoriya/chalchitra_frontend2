'use client';
import { useEffect, useState } from 'react';

export default function NotificationsDropdown({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    const res = await fetch(`/api/notifications?userId=${userId}`);
    const data = await res.json();
    setNotifications(data.notifications);
  };

  // Auto mark all as read when opened
  const handleOpen = async () => {
    setOpen(!open);
    if (!open) {
      try {
        for (const n of notifications) {
          if (!n.isRead) {
            await fetch('/api/notifications/mark-as-read', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ notifId: n._id }),
            });
          }
        }
        // Re-fetch to update local state
        fetchNotifications();
      } catch (e) {
        console.error("Error marking as read:", e);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg rounded p-2 space-y-2">
          {notifications.length === 0 && (
            <p className="text-gray-500 text-sm">No notifications</p>
          )}
          {notifications.map(notif => (
            <div key={notif._id} className={`p-2 rounded ${notif.isRead ? '' : 'bg-gray-100'}`}>
              <p className="text-sm">{notif.message}</p>
              <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
