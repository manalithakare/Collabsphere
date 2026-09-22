import { Notification } from '../models/Notification.js';

export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId });

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving notifications.',
      error: error.message,
    });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    if (String(notif.userId) !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const updated = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

    return res.json({
      success: true,
      notification: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error marking notification as read.',
      error: error.message,
    });
  }
}

export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;
    await Notification.updateMany({ userId, read: false }, { read: true });

    return res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error marking all notifications as read.',
      error: error.message,
    });
  }
}
