import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const JobsAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*');
    if (!error) setJobs(data);
    setLoading(false);
  };

  const handleDeleteJob = async (id) => {
    await supabase.from('jobs').delete().eq('id', id);
    fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
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
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Manage Jobs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full table-auto border">
          <thead className="bg-orange-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b">
                <td className="p-2">{job.title}</td>
                <td className="p-2">{job.company_name}</td>
                <td className="p-2">{job.location}</td>
                <td className="p-2 flex gap-2">
                  <button className="text-blue-600">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
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

export default JobsAdmin;
