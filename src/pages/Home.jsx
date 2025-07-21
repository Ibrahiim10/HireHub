import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import supabase from '../lib/supabase';
import DOMPurify from 'dompurify';
import { FiBriefcase, FiDollarSign, FiMapPin, FiSearch } from 'react-icons/fi';
import { BsFillBuildingFill, BsPeopleFill } from 'react-icons/bs';
import { MdWorkOutline } from 'react-icons/md';
import { RiTimerFlashLine } from 'react-icons/ri';
import { FaIndustry } from 'react-icons/fa6';
import { motion, useAnimation } from 'framer-motion';
import FeatureSection from '../components/FeatureSection';
import Testimonials from '../components/Testimonials';

function getFlagEmoji(countryName) {
  const countryMap = {
    Kenya: '🇰🇪',
    Nigeria: '🇳🇬',
    USA: '🇺🇸',
    Germany: '🇩🇪',
    Canada: '🇨🇦',
    France: '🇫🇷',
    UK: '🇬🇧',
    India: '🇮🇳',
    Ethiopia: '🇪🇹',
    Somalia: '🇸🇴',
    Tanzania: '🇹🇿',
    Uganda: '🇺🇬',
    SouthAfrica: '🇿🇦',
  };
  return countryMap[countryName] || '🌍';
}

const animatedStats = [
  {
    from: 0,
    to: 1000,
    suffix: 'K+',
    label: 'Jobs Processed',
    icon: <MdWorkOutline size={24} />,
  },
  {
    from: 0,
    to: 500,
    suffix: 'K+',
    label: 'Active Users',
    icon: <BsPeopleFill size={24} />,
  },
  {
    from: 0,
    to: 99.9,
    suffix: '%',
    label: 'Uptime Guarantee',
    icon: <RiTimerFlashLine size={24} />,
  },
  {
    from: 0,
    to: 100,
    suffix: 'K+',
    label: 'Industries Covered',
    icon: <FaIndustry size={24} />,
  },
];

const Counter = ({ from, to, suffix, label, icon }) => {
  const [value, setValue] = useState(from);
  const controls = useAnimation();

  useEffect(() => {
    let start = from;
    const step = Math.ceil((to - from) / 50);
    const interval = setInterval(() => {
      start += step;
      if (start >= to) {
        start = to;
        clearInterval(interval);
      }
      setValue(Math.floor(start * 10) / 10);
    }, 30);
    return () => clearInterval(interval);
  }, [from, to]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center justify-center gap-2 text-blue-500 text-3xl font-extrabold">
        {icon}
        <span>
          {value}
          {suffix}
        </span>
      </div>
      <p className="text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
};

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, users(id, username, avatar_url, country)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) console.error('Error fetching jobs:', error);
      if (data) setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(term) ||
      job.company_name?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-38 px-6 sm:px-10 lg:px-20 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-700 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-16 -right-10 w-96 h-96 bg-indigo-600 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Discover Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Browse thousands of jobs from top companies. Find your dream role
            today.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto flex bg-white rounded-full overflow-hidden shadow-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs, roles, or companies..."
              className="flex-1 px-5 py-3 text-gray-800 outline-none"
            />
            <button className="px-5 bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition">
              <FiSearch size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {animatedStats.map((stat, index) => (
            <Counter key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-10 text-center"
        >
          Featured Jobs
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-500">No jobs found.</p>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition border border-gray-100 p-6"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  <FiBriefcase className="inline mr-1 text-blue-500" />{' '}
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <BsFillBuildingFill className="inline mr-1 text-gray-500" />{' '}
                  {job.company_name}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  <FiMapPin className="inline mr-1" /> {job.location} •{' '}
                  {job.job_type}
                </p>
                <div
                  className="text-sm text-gray-700 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.description || ''),
                  }}
                />

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      job.users?.avatar_url || 'https://via.placeholder.com/40'
                    }
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      Posted by{' '}
                      <span className="font-medium text-gray-800">
                        {job.users?.username || 'Unknown'}
                      </span>
                    </p>
                    {job.users?.country && (
                      <p className="text-xs text-gray-500">
                        {getFlagEmoji(job.users.country)} {job.users.country}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600">
                    <FiDollarSign className="inline mr-1" /> {job.salary_range}
                  </span>
                  <Link
                    to={`/job/${job.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-xl shadow"
                  >
                    Apply Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <FeatureSection />
      <Testimonials />
    </div>
  );
};

export default Home;
