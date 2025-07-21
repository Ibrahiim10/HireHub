import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import supabase from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import QuillEditor from '../components/QuillEditor';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
    }
  }, [user, navigate, id]);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Job not found');

        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchJob(); // Only fetch if user is authenticated
  }, [id, user]);

  const handleEditorChange = (content) => {
    setContent(content);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // First check if user already applied
      const { data: existingApps, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('user_id', user.id);

      if (checkError) throw checkError;
      if (existingApps && existingApps.length > 0) {
        throw new Error('You have already applied to this position');
      }

      // Submit new application
      const { data, error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            job_id: id,
            user_id: user.id,
            cover_letter: content,
            resume_url: null,
          },
        ])
        .select();

      if (insertError) throw insertError;

      navigate('/my-applications', { state: { success: true } });
    } catch (err) {
      console.error('Application error:', err);
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render job not found
  if (!job) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
        <p className="text-center text-gray-700">Job not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Apply for: {job.title}</h2>
      <p className="text-gray-700 mb-6">
        {job.company_name} - {job.location}
      </p>

      <form onSubmit={handleApply} className="space-y-4">
        <div>
          <label
            htmlFor="coverLetter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cover Letter
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <QuillEditor
              ref={editorRef}
              value={content}
              onChange={handleEditorChange}
              placeholder={'Write your cover letter here...'}
              height="400"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 rounded-md text-white ${
              submitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyJob;
