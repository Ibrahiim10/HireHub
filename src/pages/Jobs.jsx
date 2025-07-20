import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import supabase from '../lib/supabase';
import DOMPurify from 'dompurify';
import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      else setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">Available Jobs</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >
              <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <FiBriefcase className="text-blue-500" />
                {job.title}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BsFillBuildingFill className="text-gray-500" />
                {job.company_name}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiMapPin className="text-gray-500" />
                {job.location}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiClock className="text-gray-500" />
                {job.job_type === 'remote' && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                    Remote
                  </span>
                )}
                {job.job_type === 'on-site' && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                    On-Site
                  </span>
                )}
                {job.job_type === 'hybrid' && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium">
                    Hybrid
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiDollarSign className="text-gray-500" />
                {job.salary_range}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="text-gray-500" />
                {formatDate(job.created_at)}
              </div>

              {/* 🔥 Updated: Render HTML safely and truncate */}
              <div
                className="text-sm text-gray-700 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(job.description || ''),
                }}
              />

              <Link
                to={`/job/${job.id}`}
                className="inline-block mt-2 text-sm text-blue-600 hover:shadow-lg transition bg-blue-50 px-4 py-2 rounded-lg"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default Jobs;
