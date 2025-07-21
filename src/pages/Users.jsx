import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../lib/supabase';
import { FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (!error) setUsers(data);
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center font-bold text-sm  text-white bg-blue-500 p-2 rounded-md cursor-pointer"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Manage Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2 flex gap-2">
                  <button className="text-blue-600">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
