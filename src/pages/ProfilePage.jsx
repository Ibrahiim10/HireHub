import { useEffect, useState } from 'react';
import { FiCamera, FiMail, FiUser, FiGlobe, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserProfile } from '../lib/auth';
import supabase from '../lib/supabase';

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    role: 'job_seeker',
    country: '',
    countryCode: '',
    avatar: null,
    avatarUrl: '',
  });

  const roles = ['job_seeker', 'admin', 'recruiter', 'employer'];
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchUserProfileAndCountry();
    }
  }, [user?.id]);

  const fetchUserProfileAndCountry = async () => {
    try {
      setLoading(true);
      const profile = await getUserProfile(user.id);

      let country = profile.country || '';
      let countryCode = profile.country_code || '';

      if (!country || !countryCode) {
        const res = await axios.get('https://ipapi.co/json/');
        country = res.data?.country_name || '';
        countryCode = res.data?.country || '';
      }

      setFormData({
        username: profile.username || '',
        role: profile.role || 'job_seeker',
        country,
        countryCode,
        avatar: null,
        avatarUrl: profile.avatar_url || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      avatar: file,
      avatarUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updates = {
        username: formData.username,
        role: formData.role,
        country: formData.country,
        country_code: formData.countryCode,
      };

      if (formData.avatar) {
        const ext = formData.avatar.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${ext}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData.avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath);

        updates.avatar_url = publicUrl;

        setFormData((prev) => ({
          ...prev,
          avatarUrl: publicUrl,
          avatar: null,
        }));
      }

      const { error, data } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select('username, avatar_url, role, country, country_code')
        .single();

      if (error) throw error;

      toast.success('Profile updated successfully');
      setFormData((prev) => ({
        ...prev,
        username: data.username,
        role: data.role,
        country: data.country,
        countryCode: data.country_code,
        avatarUrl: data.avatar_url,
      }));
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={formData.avatarUrl || '/default-avatar.jpg'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <FiCamera className="w-5 h-5 text-blue-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {formData.username || 'Your Profile'}
              </h2>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-2.5 text-gray-400" />
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Country + Flag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country (Auto-detected)
                </label>
                <div className="relative flex items-center pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  <FiGlobe className="absolute left-3 top-2.5 text-gray-400" />
                  <span>{formData.country}</span>
                  {formData.countryCode && (
                    <img
                      src={`https://flagcdn.com/24x18/${formData.countryCode.toLowerCase()}.png`}
                      alt={formData.country}
                      className="ml-2 w-5 h-4 rounded-sm object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 text-white rounded-md shadow-sm bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
