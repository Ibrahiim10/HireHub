import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Link } from 'react-router';
import {
  FiSearch,
  FiTrash2,
  FiEdit,
  FiUsers,
  FiBarChart2,
  FiUserPlus,
  FiBriefcase,
  FiBell,
  FiFileText,
} from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { BsFillTrash2Fill } from 'react-icons/bs';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (!error) setUsers(data);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*');
    if (!error) setJobs(data);
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase.from('applications').select('*');
    if (!error) setApplications(data);
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase.from('notifications').select('*');
    if (!error) setNotifications(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchApplications();
    fetchNotifications();
  }, []);

  const handleDeleteUser = async (id) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  const handleDeleteJob = async (id) => {
    await supabase.from('jobs').delete().eq('id', id);
    fetchJobs();
  };

  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === 'all' || user.role === selectedRole) &&
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const userChart = {
    labels: ['Admin', 'Recruiter', 'Employer', 'Job Seeker'],
    datasets: [
      {
        label: 'Users by Role',
        data: [
          users.filter((u) => u.role === 'admin').length,
          users.filter((u) => u.role === 'recruiter').length,
          users.filter((u) => u.role === 'employer').length,
          users.filter((u) => u.role === 'job_seeker').length,
        ],
        backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#facc15'],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Admin Dashboard
      </h1>

      {/* Admin Controls Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Admin Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/admin/users"
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-blue-600">
              <FiUsers size={20} />
              <span>Manage Users</span>
            </div>
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 rounded-full px-2 py-1">
              {users.length}
            </span>
          </Link>

          <Link
            to="/admin/jobs"
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-green-600">
              <FiBriefcase size={20} />
              <span>View Jobs</span>
            </div>
            <span className="text-sm font-semibold bg-green-100 text-green-700 rounded-full px-2 py-1">
              {jobs.length}
            </span>
          </Link>

          <Link
            to="/admin/applications"
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-yellow-600">
              <FiFileText size={20} />
              <span>View Applications</span>
            </div>
            <span className="text-sm font-semibold bg-yellow-100 text-yellow-700 rounded-full px-2 py-1">
              {applications.length}
            </span>
          </Link>

          <Link
            to="/admin/notifications"
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex justify-between items-center"
          >
            <div className="flex items-center gap-2 text-red-600">
              <FiBell size={20} />
              <span>Notifications</span>
            </div>
            <span className="text-sm font-semibold bg-red-100 text-red-700 rounded-full px-2 py-1">
              {notifications.length}
            </span>
          </Link>
        </div>
      </section>

      {/* User Management */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiUserPlus /> User Management
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="border rounded px-3 py-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded px-3 py-1"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruiter</option>
            <option value="employer">Employer</option>
            <option value="job_seeker">Job Seeker</option>
          </select>
        </div>

        <div className="overflow-auto max-h-[400px] border rounded shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-blue-600">
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <BsFillTrash2Fill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Job Listings */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiBriefcase /> Job Listings
        </h2>
        <div className="overflow-auto max-h-[400px] border rounded shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-orange-100 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Company</th>
                <th className="p-2">Posted At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b">
                  <td className="p-2">{job.title}</td>
                  <td className="p-2">{job.company_name}</td>
                  <td className="p-2">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 space-x-2">
                    <button className="text-blue-600">
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytics Chart */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 /> Analytics
        </h2>
        <div className="bg-white rounded p-4 shadow">
          <Bar data={userChart} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
