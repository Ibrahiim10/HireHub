import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import supabase from '../lib/supabase';
import DOMPurify from 'dompurify';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error('Error fetching job:', error);
      else setJob(data);
    };
    fetchJob();
  }, [id]);

  if (!job) return <p className="text-center mt-10">Loading job...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">
        {job.company_name} — {job.location}
      </p>
      <div className="text-sm text-blue-600 mb-4">
        {job.job_type} • {job.salary_range}
      </div>

      <div
        className="prose prose-lg max-w-none mb-6"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(job.description),
        }}
      />

      <button
        onClick={() => navigate(`/apply/${job.id}`)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobDetail;
