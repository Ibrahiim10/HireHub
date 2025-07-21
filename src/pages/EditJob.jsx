import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { FiLoader, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import QuillEditor from '../components/QuillEditor';
import supabase from '../lib/supabase';
import DOMPurify from 'dompurify';

const jobTypeOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'on-site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const countries = countryList().getData();
  const editorRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'remote',
    salary_range: '',
    description: '',
    country: '',
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error || !data) {
          toast.error('Job not found');
          navigate('/dashboard');
          return;
        }

        if (data.posted_by !== user.id && profile?.role !== 'admin') {
          toast.error('Unauthorized access');
          navigate('/dashboard');
          return;
        }

        setForm({
          title: data.title || '',
          company_name: data.company_name || '',
          location: data.location || '',
          job_type: data.job_type || 'remote',
          salary_range: data.salary_range || '',
          description: data.description || '',
          country: data.country || '',
        });

        setSelectedCountry(
          countries.find((c) => c.label === data.country) || null
        );

        setContent(data.description || '');
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job data');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId, user, profile, navigate, countries, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (html) => {
    const cleanHtml = DOMPurify.sanitize(html);
    setContent(cleanHtml);
    setForm((prev) => ({ ...prev, description: cleanHtml }));
  };

  const handleSelectChange = (option) => {
    setForm((prev) => ({ ...prev, job_type: option.value }));
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    setForm((prev) => ({ ...prev, country: option.label }));
  };

  const isEmptyDescription = (html) => {
    return (
      !html ||
      html.trim() === '' ||
      html.trim() === '<p><br></p>' ||
      html.trim() === '<p></p>'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to update a job');
      return;
    }

    if (isEmptyDescription(form.description)) {
      toast.error('Job description cannot be empty');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          ...form,
          description: DOMPurify.sanitize(form.description),
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.message || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Edit Job</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 space-y-6"
        >
          {/* --- All fields same as before --- */}
          {/* ... */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <QuillEditor
                ref={editorRef}
                value={content}
                onChange={handleEditorChange}
                placeholder="Enter detailed job description..."
                height="300"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-xl text-white transition flex items-center gap-2 ${
                submitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
