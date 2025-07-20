import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { FiLoader, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import QuillEditor from '../components/QuillEditor';
import countryList from 'react-select-country-list';

const jobTypeOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'on-site', label: 'On-Site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const PostJob = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const countries = countryList().getData();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!user || !profile || profile.role !== 'recruiter') {
      navigate('/jobs');
    }
  }, [user, profile, navigate]);

  const [form, setForm] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'remote',
    salary_range: '',
    description: '',
    country: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('https://ipapi.co/json')
      .then((res) => res.json())
      .then((data) => {
        if (data?.country_name) {
          const matched = countries.find((c) => c.label === data.country_name);
          if (matched) {
            setSelectedCountry(matched);
            setForm((prev) => ({ ...prev, country: matched.label }));
          }
        }
      })
      .catch(() => {});
  }, [countries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setContent(content);
    setForm((prev) => ({ ...prev, description: content }));
  };

  const handleSelectChange = (selectedOption) => {
    setForm({ ...form, job_type: selectedOption.value });
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setForm({ ...form, country: selectedOption.label });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.description) {
      setError('Job description is required');
      setLoading(false);
      return;
    }

    const jobData = {
      ...form,
      posted_by: user?.id,
    };

    const { error: jobError } = await supabase.from('jobs').insert([jobData]);

    if (jobError) {
      console.error('Error posting job:', jobError);
      setError(jobError.message || 'Failed to post job.');
      toast.error(jobError.message || 'Failed to post job.');
      setLoading(false);
      return;
    }

    if (form.country && !profile?.country) {
      await supabase
        .from('users')
        .update({ country: form.country })
        .eq('id', user.id);
    }

    toast.success('Job posted successfully!');
    navigate('/jobs');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-12">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-8 space-y-6"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              name="title"
              value={form.title}
              required
              placeholder="e.g., Frontend Developer"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              name="company_name"
              value={form.company_name}
              required
              placeholder="Company Inc."
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                required
                placeholder="e.g., Nairobi, Kenya"
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <Select
                options={jobTypeOptions}
                value={jobTypeOptions.find(
                  (option) => option.value === form.job_type
                )}
                onChange={handleSelectChange}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Country
              </label>
              <Select
                options={countries}
                value={selectedCountry}
                onChange={handleCountryChange}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              name="salary_range"
              value={form.salary_range}
              required
              placeholder="e.g., $1000 - $2000"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <QuillEditor
                value={content}
                onChange={(html) => setContent(html)}
                placeholder="Enter your content..."
                height={500}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-white transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Posting...
              </>
            ) : (
              <>
                <FiSave /> Post Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
