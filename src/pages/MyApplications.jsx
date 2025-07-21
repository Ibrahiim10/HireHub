import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { FiFileText, FiTrash2 } from 'react-icons/fi';

const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(
        `
        id,
        cover_letter,
        applied_at,
        jobs (
          id,
          title,
          company_name
        ),
        user:users (
          id,
          username,
          email
        )
      `
      )
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching applications:', error.message);
      setApplications([]);
    } else {
      setApplications(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this application?');
    if (!confirm) return;

    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (!error) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <FiFileText /> All Job Applications
      </h1>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-600">No applications found.</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded shadow p-4 border hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-700">
                  {app.jobs?.title} @ {app.jobs?.company_name}
                </h3>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                Applicant: <strong>{app.user?.username}</strong> (
                {app.user?.email})
              </p>

              <p className="text-sm text-gray-500">
                Applied on:{' '}
                {new Date(app.applied_at).toLocaleDateString('en-US')}
              </p>

              <div className="mt-2 text-sm text-gray-800">
                <strong>Cover Letter:</strong> {app.cover_letter || '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsAdmin;
