import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import {
  FaRegEdit,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaBell,
} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { IoIosNotifications } from 'react-icons/io';
import useApplicationRealtime from '../lib/ApplicationRealtime';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  const isAdmin = profile?.role === 'admin';
  const isRecruiter = profile?.role === 'recruiter';
  const isEmployer = profile?.role === 'employer';
  const isJobSeeker = profile?.role === 'job_seeker';

  useApplicationRealtime({
    onNewApplication: async (application) => {
      if (jobs.some((job) => job.id === application.job_id)) {
        try {
          const { error } = await supabase.from('notifications').insert({
            user_id: application.job.posted_by,
            job_id: application.job_id,
            application_id: application.id,
            message: `New application for "${application.job.title}" from ${
              application.user.username || 'a candidate'
            }`,
            type: 'new_application',
          });

          if (error) throw error;
          await fetchNotifications();

          if (user?.id === application.job.posted_by) {
            toast.success(`New application for "${application.job.title}"`);
          }
        } catch (error) {
          console.error('Notification creation failed:', error);
        }
      }
    },
  });

  const fetchCounts = async () => {
    if (!isAdmin) return;
    const { count: users } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    const { count: jobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    const { count: apps } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    setUserCount(users || 0);
    setJobCount(jobs || 0);
    setApplicationCount(apps || 0);
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `*, job:jobs(title), application:applications(id, user:users(username))`
        )
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !profile) return;
      setLoading(true);
      try {
        if (isRecruiter || isAdmin) {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('posted_by', user.id)
            .order('created_at', { ascending: false });
          if (error) throw error;
          setJobs(data || []);
        }

        if (isJobSeeker) {
          const { data, error } = await supabase
            .from('applications')
            .select('*, jobs(*)')
            .eq('user_id', user.id)
            .order('applied_at', { ascending: false });
          if (error) throw error;
          setApplications(data || []);
        }

        await fetchNotifications();
        await fetchCounts();
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
        toast.error('Dashboard load failed');
      }
      setLoading(false);
    };

    fetchData();
  }, [user, profile]);

  useEffect(() => {
    if (!user) return;

    const notificationSubscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          if (!payload.new.read) {
            toast.success(payload.new.message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationSubscription);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchUnread = async () => {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('read', false);
        setUnreadCount(count || 0);
      };
      fetchUnread();
    }
  }, [user]);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Job deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) throw error;
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (!user || !profile) return <p>Loading profile...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-blue-600 mb-8 border-b pb-2">
          Dashboard - <span className="capitalize">{profile.role}</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-red-600 flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </div>
        ) : (
          <>
            {(isAdmin || isRecruiter) && (
              <section className="mb-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Notifications
                  </h3>
                  <div className="flex items-center gap-4">
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                    <span className="text-gray-700 text-lg px-3 py-1 rounded-full bg-blue-50">
                      {unreadCount}
                      <IoIosNotifications className="inline ml-1" />
                    </span>
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications yet</p>
                ) : (
                  <ul className="space-y-3">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-4 rounded-lg mb-2 ${
                          notification.read
                            ? 'bg-gray-50'
                            : 'bg-blue-50 border-l-4 border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">
                              {notification.message}
                            </p>
                            {notification.job && (
                              <Link
                                to={`/job/${notification.job_id}/applications`}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View applications
                              </Link>
                            )}
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {isAdmin && (
              <section className="mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Admin Controls
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <Link
                    to="/admin/users"
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center"
                  >
                    <FaUsers className="text-3xl text-blue-500 mb-2" />
                    <span className="text-lg font-medium">Manage Users</span>
                    <span className="text-sm text-gray-600 mt-1">
                      👥 Total: {userCount}
                    </span>
                  </Link>

                  <Link
                    to="/admin/jobs"
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center"
                  >
                    <FaBriefcase className="text-3xl text-green-500 mb-2" />
                    <span className="text-lg font-medium">View All Jobs</span>
                    <span className="text-sm text-gray-600 mt-1">
                      💼 Total: {jobCount}
                    </span>
                  </Link>

                  <Link
                    to="/admin/applications"
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center"
                  >
                    <FaFileAlt className="text-3xl text-purple-500 mb-2" />
                    <span className="text-lg font-medium">
                      View Applications
                    </span>
                    <span className="text-sm text-gray-600 mt-1">
                      📄 Total: {applicationCount}
                    </span>
                  </Link>

                  <Link
                    to="/admin/notifications"
                    className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center"
                  >
                    <FaBell className="text-3xl text-yellow-500 mb-2" />
                    <span className="text-lg font-medium">
                      All Notifications
                    </span>
                  </Link>
                </div>
              </section>
            )}

            {isRecruiter && (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    My Posted Jobs
                  </h3>
                  <Link
                    to="/post-job"
                    className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                  >
                    + Post Job
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {jobs.length === 0 ? (
                    <p className="text-gray-500">
                      You haven't posted any jobs yet
                    </p>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="bg-white p-5 rounded-xl shadow hover:shadow-md"
                      >
                        <h4 className="text-lg font-bold text-blue-700 mb-1">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(job.created_at)}
                        </p>
                        <div className="flex gap-3 mt-3">
                          <Link
                            to={`/edit-job/${job.id}`}
                            className="text-blue-600 flex items-center gap-1 hover:underline"
                          >
                            <FaRegEdit /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            <MdDelete /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {isEmployer && (
              <section className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Employer Overview
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    to="/employer/jobs"
                    className="bg-white p-5 rounded-xl shadow hover:shadow-md"
                  >
                    Company Jobs
                  </Link>
                  <Link
                    to="/employer/applications"
                    className="bg-white p-5 rounded-xl shadow hover:shadow-md"
                  >
                    Company Applications
                  </Link>
                </div>
              </section>
            )}

            {isJobSeeker && (
              <section>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  My Applications
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {applications.length === 0 ? (
                    <p className="text-gray-500">
                      You haven't applied to any jobs yet
                    </p>
                  ) : (
                    applications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white p-5 rounded-xl shadow hover:shadow-md"
                      >
                        <h4 className="font-bold text-blue-700 text-lg mb-1">
                          {app.jobs?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(app.applied_at)}
                        </p>
                        <p className="text-sm text-gray-800 mt-2">
                          {app.cover_letter}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
