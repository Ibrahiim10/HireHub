import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const AdminNotifications = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAllNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `
          id,
          message,
          read,
          created_at,
          users: user_id (username, email),
          jobs (title)
        `
        )
        .order('created_at', { ascending: false });

      if (!error) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchAllNotifications();
  }, [isAdmin]);

  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center font-bold text-sm  text-white bg-blue-500 p-2 rounded-md cursor-pointer"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <FiBell /> All Notifications
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600"
            >
              <p className="text-sm text-gray-700">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                Posted by: <strong>{notif.users?.username}</strong> (
                {notif.users?.email}) — Job: {notif.jobs?.title}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(notif.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;
