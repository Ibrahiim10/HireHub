import React from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import UnAuthenticatedRoute from './components/UnAuthenticatedRoute';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import JobsAdmin from './pages/JobsAdmin';
import ApplicationsAdmin from './pages/ApplicationsAdmin';
import AdminNotifications from './pages/AdminNotifications';
import EditJob from './pages/EditJob';

const App = () => {
  return (
    <AuthProvider>
      <div>
        {/* header */}
        <Header />
        <main>
          {/* routes */}
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/edit-job/:jobId" element={<EditJob />} />

            {/* unauthenticated routes (redirect home if login) */}

            <Route
              path="/signin"
              element={
                <UnAuthenticatedRoute>
                  <Signin />
                </UnAuthenticatedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <UnAuthenticatedRoute>
                  <Signup />
                </UnAuthenticatedRoute>
              }
            />

            {/* protected route */}
            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={['recruiter', 'employer']}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/:id"
              element={
                <ProtectedRoute>
                  <ApplyJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/jobs" element={<JobsAdmin />} />
            <Route path="/admin/applications" element={<ApplicationsAdmin />} />
            <Route
              path="/admin/notifications"
              element={<AdminNotifications />}
            />
          </Routes>
        </main>
        {/* footer */}
        <Footer />
      </div>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
