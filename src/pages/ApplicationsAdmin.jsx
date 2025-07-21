import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FiArrowLeft, FiUsers } from 'react-icons/fi';
import supabase from '../lib/supabase';

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('applications')
        .select(
          `
          id,
          applied_at,
          cover_letter,
          users (
            username,
            email
          ),
          jobs (
            title,
            company_name
          )
        `
        )
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error.message);
        setApplications([]);
      } else {
        setApplications(data);
      }

      setLoading(false);
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center font-bold text-sm text-white bg-blue-500 p-2 rounded-md cursor-pointer"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
        <FiUsers /> All Job Applications
      </h1>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-auto border rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 text-left">Applicant</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Job Title</th>
                <th className="p-2 text-left">Company</th>
                <th className="p-2 text-left">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{app.users?.username || '—'}</td>
                  <td className="p-2">{app.users?.email || '—'}</td>
                  <td className="p-2">{app.jobs?.title || '—'}</td>
                  <td className="p-2">{app.jobs?.company_name || '—'}</td>
                  <td className="p-2">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsAdmin;
