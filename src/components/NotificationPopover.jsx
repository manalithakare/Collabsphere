import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, CheckCheck, Sparkles, AlertCircle } from 'lucide-react';
import { notificationApi } from '../services/api.js';

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef(null);

  async function loadNotifications() {
    try {
      setIsLoading(true);
      const res = await notificationApi.getAll();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // Ignore background notification fetch error
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleMarkAsRead(id, e) {
    e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  }

  function getNotificationIcon(type) {
    if (type === 'request') return <Sparkles className="w-4 h-4 text-pink-400" />;
    if (type === 'accepted') return <Check className="w-4 h-4 text-emerald-400" />;
    if (type === 'payment_update') return <CheckCheck className="w-4 h-4 text-purple-400" />;
    if (type === 'rejected') return <AlertCircle className="w-4 h-4 text-rose-400" />;
    return <Clock className="w-4 h-4 text-zinc-400" />;
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-extrabold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border border-[#0B0B12] shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 border border-white/10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#0B0B12]/80">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-wide">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-pink-300 border border-pink-500/30 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-purple-400 hover:text-pink-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {isLoading && notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                <Bell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-zinc-300">All caught up</p>
                <p className="text-[11px] text-zinc-500 mt-1">Updates on collaborations and payouts will stream here.</p>
              </div>
            ) : (
              notifications.map((item) => {
                const id = item._id || item.id;
                return (
                  <div
                    key={id}
                    className={`flex items-start gap-3 p-3.5 transition-colors ${
                      item.read
                        ? 'bg-transparent hover:bg-white/5'
                        : 'bg-purple-950/20 hover:bg-purple-950/35 border-l-2 border-pink-500'
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 border border-white/5 shrink-0">
                      {getNotificationIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-zinc-200 leading-snug">{item.message}</p>
                      <span className="text-[10px] text-zinc-500 mt-1 inline-block">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    {!item.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(id, e)}
                        className="text-zinc-500 hover:text-pink-400 p-1 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPopover;
